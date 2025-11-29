const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getMyFeedback,
  getEventFeedback,
} = require("../controllers/feedbackController");

// @route   POST /api/feedback
// @desc    Submit feedback for an event
// @access  Private/Student
router.post("/", protect, submitFeedback);

// @route   GET /api/feedback/my
// @desc    Get feedback submitted by the logged-in user
// @access  Private/Student
router.get("/my", protect, getMyFeedback);

// @route   GET /api/feedback/event/:eventId
// @desc    Get all feedback for a specific event (Admin/Organizer)
// @access  Private/Admin
router.get("/event/:eventId", protect, admin, getEventFeedback);

module.exports = router;