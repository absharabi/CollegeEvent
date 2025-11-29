const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

// @route   GET /api/admin/stats
// @desc    Get dashboard summary statistics
// @access  Private/Admin
router.get("/stats", protect, admin, getDashboardStats);

module.exports = router;