const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger - Place this before your routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const userRoutes = require("./routes/users");
const requestRoutes = require("./routes/requests");
const resultRoutes = require("./routes/results");
const diagnosticRoutes = require("./routes/diagnostics");
const notificationRoutes = require("./routes/notifications");
const vehicleRoutes = require("./routes/vehicles");
const mechanicRoutes = require("./routes/mechanics");
const diagnoseRoutes = require("./routes/diagnose"); 
const youtubeRouter = require("./routes/youtube");

app.use("/users", userRoutes);
app.use("/requests", requestRoutes);
app.use("/results", resultRoutes);
app.use("/diagnostics", diagnosticRoutes);
app.use("/notifications", notificationRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/mechanics", mechanicRoutes);
app.use("/diagnose", diagnoseRoutes);
app.use("/youtube", youtubeRouter);

app.get("/", (req, res) => {
  res.send("MFix backend is running!");
});

// Global Error Handling Middleware
// This should be the LAST middleware. It will catch any errors passed by next()
// (e.g., from multer) and prevent the default HTML error page.
app.use((err, req, res, next) => {
  console.error("An unhandled error occurred:", err.stack);
  res.status(500).json({ error: "An internal server error occurred", message: err.message });
});

const PORT = process.env.PORT || 2020;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
