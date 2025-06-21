// routes/mechanics.js

const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// POST /mechanics - Add mechanic profile
router.post("/", async (req, res) => {
  const { userId, location, availability, rating } = req.body;

  if (!userId || !location || availability === undefined || rating === undefined) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const mechanicData = {
      userId,
      location,
      availability,
      rating
    };

    const docRef = await db.collection("mechanics").add(mechanicData);

    return res.status(201).json({
      message: "Mechanic profile created",
      mechanicId: docRef.id
    });
  } catch (error) {
    console.error("Error adding mechanic:", error);
    return res.status(500).json({ error: "Failed to add mechanic" });
  }
});

// GET /mechanics - Get all mechanics
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("mechanics").get();
    const mechanics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(mechanics);
  } catch (error) {
    console.error("Error fetching mechanics:", error);
    return res.status(500).json({ error: "Failed to fetch mechanics" });
  }
});

module.exports = router;