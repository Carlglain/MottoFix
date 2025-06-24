const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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

app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
