// Load environment variables FIRST
const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/db"); // Your Sequelize connection
const { User, Event, Registration, Feedback } = require("./models"); // Import models and associations

const startServer = async () => {
  // Connect to database
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors()); // Enable CORS for all origins
  app.use(express.json()); // Body parser for JSON data

  // Routes
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/events", require("./routes/eventRoutes"));
  app.use("/api/registration", require("./routes/registrationRoutes"));
  app.use("/api/feedback", require("./routes/feedbackRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));

  // Basic route for testing
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  // Database synchronization
  const PORT = process.env.PORT || 5000;
  await sequelize.sync({ force: false }) // Set to false for production/regular use to prevent data loss
    .then(() => {
      console.log("Database synced successfully");
      // Start the server only after the database is ready
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Error syncing database:", err);
      process.exit(1); // Exit if sync fails
    });
};

startServer();