const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config(); // Load .env variables

// 🔧 Dummy ML Response Generator (used only for sound)
async function runML(type, input) {
  if (type === "sound") {
    const formData = new FormData();
    formData.append("audio", input);

    try {
      const response = await fetch("http://127.0.0.1:5000/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get diagnosis from backend");
      }

      const data = await response.json();

      // ✅ Only return faultName now
      return {
        faultName: data.predicted_fault,
      };
    } catch (error) {
      console.error("ML error:", error);
      return {
        faultName: "Error",
      };
    }
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
    const { userId, vehicleId, inputData } = req.body;
  
    if (!userId || !inputData) {
      return res.status(400).json({ error: "Missing parameters" });
    }
  
    try {
      const result = await runML("sound", inputData);
  
      // ✅ Use Gemini API to get explanation and recommendation
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
  
      res.status(201).json({
        message: "Sound diagnosis complete",
        result: {
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
                data: inputData // base64-encoded JPEG, no prefix
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
module.exports =router