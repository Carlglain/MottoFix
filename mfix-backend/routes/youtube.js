const express = require('express');
const axios = require('axios');

const router = express.Router();

async function fetchYoutubeVideo(faultName) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API key is missing. Please set YOUTUBE_API_KEY in your .env file.");
    // Don't attempt the request if the key is missing.
    return null;
  }
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

router.get('/fetch-video', async (req, res) => {
  const { faultName } = req.query;

  if (!faultName) {
    return res.status(400).send('faultName query parameter is required');
  }

  const videoUrl = await fetchYoutubeVideo(faultName);
  if (videoUrl) {
    res.json({ videoUrl });
  } else {
    res.status(404).send('Video not found');
  }
});

module.exports = router;