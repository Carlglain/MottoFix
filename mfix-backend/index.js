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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
