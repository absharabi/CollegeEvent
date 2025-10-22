const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  getEventFeedback,
  getEventRegistrations,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, isOrganizerOrAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getAllEvents).post(protect, isOrganizerOrAdmin, createEvent);

router.route("/:id")
  .get(getEventById)
  .put(protect, isOrganizerOrAdmin, updateEvent)
  .delete(protect, isOrganizerOrAdmin, deleteEvent);

router
  .route("/:id/registrations")
  .get(protect, isOrganizerOrAdmin, getEventRegistrations);

router
  .route("/:id/feedback")
  .get(protect, isOrganizerOrAdmin, getEventFeedback);

module.exports = router;