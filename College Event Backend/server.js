const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ API Routes
app.use("/api/auth", authRoutes);                // Register/Login
app.use("/api/events", eventRoutes);             // Event CRUD & listing
app.use("/api/registration", registrationRoutes); // Event registrations
app.use("/api/feedback", feedbackRoutes);         // Feedback system

// ✅ Database Sync
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ MySQL tables synced successfully"))
  .catch((err) => console.error("❌ Error syncing tables:", err));

// ✅ Root endpoint
app.get("/", (req, res) => res.send("🎓 College Event Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
