// routes/requests.js

const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// ✅ POST /requests - Create a new service request
router.post("/", async (req, res) => {
  const { userId, mechanicId, issue, status } = req.body;

  if (!userId || !mechanicId || !issue || !status) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newRequest = { userId, mechanicId, issue, status, createdAt: new Date() };

    const docRef = await db.collection("requests").add(newRequest);

    return res.status(201).json({
      message: "Request created successfully",
      requestId: docRef.id,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ error: "Failed to create request" });
  }
});

// ✅ GET /requests/user/:userId - Get all requests made by a user
router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const snapshot = await db.collection("requests").where("userId", "==", userId).get();

    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return res.status(500).json({ error: "Failed to fetch requests" });
  }
});

module.exports = router;
