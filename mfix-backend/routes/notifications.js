const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// POST /notifications - Create a new notification
router.post("/", async (req, res) => {
  const { userId, message, resultId } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required" });
  }

  try {
    const notification = {
      userId,
      message,
      resultId: resultId || null,
      read: false,
      timestamp: new Date()
    };

    const docRef = await db.collection("notifications").add(notification);

    return res.status(201).json({ message: "Notification sent", notificationId: docRef.id });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

// GET /notifications/:userId - Get all notifications for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db.collection("notifications").where("userId", "==", userId).get();

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
