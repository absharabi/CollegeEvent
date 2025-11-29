const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  updateAttendance,
  getMyCertificates,
  markMyAttendance,
} = require("../controllers/registrationController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/registration/my
// @desc    Get registrations for the logged-in user
// @access  Private
router.get("/my", protect, getMyRegistrations);

// @route   GET /api/registration/my-certificates
// @desc    Get all certificates for the logged-in user
// @access  Private
router.get("/my-certificates", protect, getMyCertificates);

// @route   POST /api/registration/:eventId
// @desc    Register for an event
// @access  Private
router.post("/:eventId", protect, registerForEvent);

// @route   PUT /api/registration/mark-attended/:registrationId
// @desc    Student marks their own attendance
// @access  Private
router.put("/mark-attended/:registrationId", protect, markMyAttendance);

// @route   PUT /api/registrations/:id/attendance
// @desc    Update attendance for a registration
// @access  Private/Admin
router.put("/:registrationId/attendance", protect, admin, updateAttendance);

module.exports = router;