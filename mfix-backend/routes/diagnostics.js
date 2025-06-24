const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// POST /diagnostics - Start a new diagnostic session
router.post("/", async (req, res) => {
  const { userId, vehicleId, type, resultId } = req.body;

  if (!userId || !type || !resultId) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const diagnosticData = {
      userId,
      vehicleId: vehicleId || null,
      type,
      status: "completed",
      resultId,
      timestamp: new Date()
    };

    const docRef = await db.collection("diagnostics").add(diagnosticData);

    return res.status(201).json({ message: "Diagnostic recorded", diagnosticId: docRef.id });
  } catch (error) {
    console.error("Error saving diagnostic:", error);
    return res.status(500).json({ error: "Failed to save diagnostic" });
  }
});

// GET /diagnostics/user/:userId - Get diagnostics by user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db.collection("diagnostics").where("userId", "==", userId).get();

    const diagnostics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(diagnostics);
  } catch (error) {
    console.error("Error fetching diagnostics:", error);
    return res.status(500).json({ error: "Failed to fetch diagnostics" });
  }
});

module.exports = router;