const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// POST /results - Save diagnosis result
router.post("/", async (req, res) => {
  const { faultName, explanation, recommendation, videoUrl, confidenceScore } = req.body;

  if (!faultName || !explanation || !recommendation) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const resultData = {
      faultName,
      explanation,
      recommendation,
      videoUrl: videoUrl || null,
      confidenceScore: confidenceScore || null,
      createdAt: new Date()
    };

    const docRef = await db.collection("results").add(resultData);

    return res.status(201).json({ message: "Result saved", resultId: docRef.id });
  } catch (error) {
    console.error("Error saving result:", error);
    return res.status(500).json({ error: "Failed to save result" });
  }
});

// GET /results/:id - Get a result by ID
router.get("/:id", async (req, res) => {
  const resultId = req.params.id;

  try {
    const doc = await db.collection("results").doc(resultId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Result not found" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching result:", error);
    return res.status(500).json({ error: "Failed to fetch result" });
  }
});

module.exports = router;