const express = require("express");
const router = express.Router();

const axios = require("axios");
const FormData = require("form-data");
const { db } = require("../firebase");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
require("dotenv").config();

// FFmpeg will be found automatically from system PATH

// Function to convert audio buffer to WAV buffer using temporary files
async function convertAudioToWAV(inputBuffer, originalName) {
  let tempInputPath;
  let tempOutputPath;
  
  try {
    // Create temporary file paths
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const inputExt = path.extname(originalName) || '.m4a';
    tempInputPath = path.join(tempDir, `input_${timestamp}${inputExt}`);
    tempOutputPath = path.join(tempDir, `output_${timestamp}.wav`);

    // Write the input buffer to a temporary file
    await fs.writeFile(tempInputPath, inputBuffer);

    // Convert audio using fluent-ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .audioCodec('pcm_s16le') // PCM 16-bit little-endian for WAV
        .audioChannels(1) // Mono channel
        .audioFrequency(16000) // 16kHz sample rate
        .format('wav')
        .output(tempOutputPath)
        .on('end', () => {
          console.log(`Successfully converted ${originalName} to WAV.`);
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg conversion error:', err);
          reject(new Error(`Audio conversion failed: ${err.message}`));
        })
        .run();
    });

    // Read the converted WAV file
    const wavBuffer = await fs.readFile(tempOutputPath);
    return wavBuffer;
    
  } catch (error) {
    console.error("Audio conversion failed:", error);
    throw new Error("Failed to convert audio to WAV for ML service");
  } finally {
    // Clean up temporary files
    try {
      if (tempInputPath) await fs.unlink(tempInputPath);
      if (tempOutputPath) await fs.unlink(tempOutputPath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary files:', cleanupError);
    }
  }
}

// 🔧 ML service function for sound
async function runMLSound(audioBuffer, originalname) {
  let wavAudioBuffer;
  let wavFilename = originalname.replace(/\.(m4a|mp3|aac|ogg)$/i, '.wav');

  try {
    // Convert the incoming audio buffer to WAV
    wavAudioBuffer = await convertAudioToWAV(audioBuffer, originalname);
  } catch (conversionError) {
    console.error("Audio conversion failed:", conversionError);
    throw new Error("Failed to convert audio to WAV for ML service");
  }

  // Create form data for the Python service
  const formData = new FormData();
  formData.append("audio", wavAudioBuffer, { 
    filename: wavFilename, 
    contentType: 'audio/wav' 
  });

  try {
    // Send to Python ML service
    const response = await axios.post("http://127.0.0.1:5000/diagnose", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (!response.data || !response.data.predicted_fault) {
        throw new Error("Invalid response from ML service");
    }

    return {
      faultName: response.data.predicted_fault,
    };
  } catch (error) {
    console.error("ML service error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to get diagnosis from Python ML service");
  }
}

// 🔧 Dummy ML Response Generator (used only for sound)
function runFakeML(type, input) {
  if (type === "sound") {
    return {
      faultName: "Loose Timing Belt",
      explanation: "The timing belt is loose and may cause engine misfires.",
      recommendation: "Have a mechanic inspect and tighten the timing belt."
    };

  }
}

// 📺 Fetch YouTube Video Using Fault Name
async function fetchYoutubeVideo(faultName) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = encodeURIComponent(`${faultName} car repair`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}&maxResults=1`;

  try {
    const response = await axios.get(url);
    const videoId = response.data.items[0]?.id?.videoId;
    return videoId ? `https://youtube.com/watch?v=${videoId}` : null;
  } catch (error) {
    console.error("YouTube API error:", error.message);
    return null;
  }
}

// ✅ POST /diagnose/sound
router.post("/sound", async (req, res) => {
  const { userId, vehicleId, inputData, originalName } = req.body;

  if (!userId || !inputData || !originalName) {
    return res.status(400).json({ error: "Missing userId, audio data (inputData), or originalName" });
  }

  try {
    // Convert the base64 audio string back into a Buffer
    const audioBuffer = Buffer.from(inputData, 'base64');

    const result = await runMLSound(audioBuffer, originalName);
    
    // Use Gemini API to get explanation and recommendation
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiPrompt = `Provide detailed car engine diagnostic info for the fault: "${result.faultName}". Respond ONLY with a JSON object containing the following:
    "faultName": (string)
    "explanation": (string)
    "recommendation": (string)`;

    const geminiPayload = {
      contents: [{ parts: [{ text: geminiPrompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    };

    const geminiRes = await axios.post(geminiUrl, geminiPayload);
    const jsonString = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonString) throw new Error("No valid JSON response from Gemini.");

    let parsedGemini;
    try {
      parsedGemini = JSON.parse(jsonString);
    } catch (parseError) {
      throw new Error("Invalid JSON format received from Gemini.");
    }

    const { faultName, explanation, recommendation } = parsedGemini;
    const videoUrl = await fetchYoutubeVideo(faultName);

    // Save result to Firestore
    const resultDoc = await db.collection("results").add({
      faultName,
      explanation,
      recommendation,

      videoUrl,
      createdAt: new Date()
    });


    // Save diagnostic session to Firestore
    const diagnosticDoc = await db.collection("diagnostics").add({
      userId,
      vehicleId: vehicleId || null,
      type: "sound",
      status: "completed",
      resultId: resultDoc.id,
      timestamp: new Date()
    });

    res.status(201).json({
      message: "Sound diagnosis complete",
      diagnosticId: diagnosticDoc.id,

      result: {
        id: resultDoc.id,
        faultName,
        explanation,
        recommendation,
        videoUrl,
      },

    });
  } catch (error) {
    console.error("Sound diagnosis error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Sound diagnosis failed" });
  }
});

// ✅ POST /diagnose/image (uses Gemini API)
router.post("/image", async (req, res) => {
  const { userId, vehicleId, inputData } = req.body;

  if (!userId || !inputData) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;


    const promptText = `Analyze this car dashboard warning light image. Respond ONLY with a JSON object containing the following keys:
      "faultName": (string, concise name of the fault)
      "explanation": (string, detailed explanation of the fault)
      "recommendation": (string, actionable advice for repair or next steps)
      Do not include any other text or formatting outside the JSON.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: "image/jpeg",

                data: inputData
              }
            }
          ]
        }
      ],

              
      // Add generation config to request JSON output

      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const geminiRes = await axios.post(geminiUrl, payload);

    console.log("Gemini raw response:", JSON.stringify(geminiRes.data, null, 2)); // Debug log for raw response


    const jsonString = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonString) {
      throw new Error("No valid JSON response from Gemini.");
    }


    // Attempt to parse the JSON string
    let parsedGeminiResult;
    try {
      parsedGeminiResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response:", parseError);
      throw new Error("Invalid JSON format received from Gemini.");
    }

    const { faultName, explanation, recommendation } = parsedGeminiResult;


    // Validate that required fields are present

    if (!faultName || !explanation || !recommendation) {
      throw new Error("Gemini response is missing required fields (faultName, explanation, or recommendation).");
    }

    const result = {
      faultName,
      explanation,
      recommendation
    };

    const videoUrl = await fetchYoutubeVideo(result.faultName);

    const resultDoc = await db.collection("results").add({
      ...result,
      videoUrl,
      createdAt: new Date()
    });

    const diagnosticDoc = await db.collection("diagnostics").add({
      userId,
      vehicleId: vehicleId || null,
      type: "image",
      status: "completed",
      resultId: resultDoc.id,
      timestamp: new Date()
    });

    res.status(201).json({
      message: "Image diagnosis complete",
      diagnosticId: diagnosticDoc.id,
      result: { id: resultDoc.id, ...result, videoUrl }
    });
  } catch (error) {
    console.error("Image diagnosis error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Image diagnosis failed" });
  }
});


module.exports = router;

