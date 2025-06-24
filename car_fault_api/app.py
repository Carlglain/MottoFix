from flask import Flask, request, jsonify
from flask_cors import CORS 
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification
import soundfile as sf
import torch
import os
import io

app = Flask(__name__)
CORS(app)

# --- Configuration ---
# IMPORTANT: Replace with the path where you saved your trained model locally
# This should be the same as MODEL_OUTPUT_DIR from train_model.py
MODEL_PATH = "../python_ml_service/venv/my_awesome_car_fault_model"

# --- Load Model and Feature Extractor ---
print(f"Loading model from {MODEL_PATH}...")
try:
    feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_PATH)
    model = AutoModelForAudioClassification.from_pretrained(MODEL_PATH)
    # Move model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval() # Set model to evaluation mode
    print("Model and feature extractor loaded successfully.")
    print(f"Model will run on: {device}")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Please ensure the model files (config.json, pytorch_model.bin, preprocessor_config.json) are in the MODEL_PATH.")
    exit() # Exit if model loading fails

@app.route('/diagnose', methods=['POST'])
def diagnose_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    if not audio_file.filename.endswith(('.wav', '.mp3', '.flac')): # Add more formats if needed
        return jsonify({"error": "Unsupported audio format"}), 400

    try:
        # Read audio data from the uploaded file
        audio_bytes = audio_file.read()
        # Use soundfile to read the audio data into a numpy array
        # io.BytesIO allows soundfile to read from bytes directly
        audio_array, sampling_rate = sf.read(io.BytesIO(audio_bytes))

        # Resample if necessary (though feature_extractor handles this implicitly with its sampling_rate)
        # The feature extractor will automatically resample if input_audio_sampling_rate != model_sampling_rate
        # No explicit resampling needed here, but make sure the input audio is close to what the model expects.

        # Preprocess the audio
        # feature_extractor.sampling_rate is the sampling rate the model expects (e.g., 16000 Hz)
        inputs = feature_extractor(
            audio_array,
            sampling_rate=sampling_rate,
            return_tensors="pt", # Return PyTorch tensors
            max_length=feature_extractor.sampling_rate * 5, # Match max_length used during training
            truncation=True
        )

        # Move inputs to the same device as the model (GPU if available)
        inputs = {k: v.to(device) for k, v in inputs.items()}

        # Perform inference
        # Perform inference
        with torch.no_grad():
            logits = model(**inputs).logits

        # Get probabilities
        probabilities = torch.softmax(logits, dim=-1)[0]
        predicted_class_id = torch.argmax(logits).item()
        predicted_label = model.config.id2label[predicted_class_id]

        # Return only the predicted fault
        return jsonify({"predicted_fault": predicted_label}), 200


    except Exception as e:
        print(f"Error during audio processing or inference: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)