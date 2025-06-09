const express = require("express");
const router = express.Router();
const { db } = require("../firebase");  // import db from firebase.js

// ✅ POST /users - Create a new user
router.post("/", async (req, res) => {
  const { name, email, role, phone } = req.body;

  if (!name || !email || !role || !phone) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newUser = { name, email, role, phone };
    const docRef = await db.collection("users").add(newUser);

    return res.status(201).json({
      message: "User created successfully",
      userId: docRef.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// ✅ GET /users - Get all users
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ GET /users/:id - Get a user by ID
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
