// File: routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  generateCertificate,
} = require("../controllers/eventController");

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// New route to get events by category
router.get("/category/:categoryName", getAllEvents);

// Admin protected routes
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

// Admin/Organizer view of registrations
router.get("/:id/registrations", protect, admin, getEventRegistrations);

// Certificate download
router.get("/:eventId/certificate", protect, generateCertificate);

module.exports = router;
