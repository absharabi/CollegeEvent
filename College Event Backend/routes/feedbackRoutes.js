const express = require("express");
const {
  submitFeedback,
  getEventFeedback,
  getUserFeedback
} = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit feedback for an event
router.post("/submit", authMiddleware, submitFeedback);

// Get feedback for a specific event
router.get("/event/:eventId", getEventFeedback);

// Get feedback given by the logged-in user
router.get("/my", authMiddleware, getUserFeedback);

module.exports = router;
