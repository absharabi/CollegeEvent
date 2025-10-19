const express = require("express");
const {
  registerEvent,
  getUserRegistrations,
  getEventAttendees
} = require("../controllers/registrationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a user for an event
router.post("/register", authMiddleware, registerEvent);

// Get all events a user registered for
router.get("/my", authMiddleware, getUserRegistrations);

// Get all attendees for a specific event (Organizer/Admin only)
router.get("/event/:eventId/attendees", authMiddleware, getEventAttendees);

module.exports = router;
