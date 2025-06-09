// routes/vehicles.js

const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// POST /vehicles - Add a new vehicle
router.post("/", async (req, res) => {
  const { userId, make, model, year } = req.body;

  if (!userId || !make || !model || !year) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const vehicleData = { userId, make, model, year };
    const docRef = await db.collection("vehicles").add(vehicleData);

    return res.status(201).json({
      message: "Vehicle added successfully",
      vehicleId: docRef.id
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return res.status(500).json({ error: "Failed to add vehicle" });
  }
});

// GET /vehicles/user/:userId - Get all vehicles for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db.collection("vehicles").where("userId", "==", userId).get();
    const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

module.exports = router;
