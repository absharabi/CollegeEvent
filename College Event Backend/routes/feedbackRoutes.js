const express = require("express");
const router = express.Router();
const { createFeedback, getMyFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createFeedback);
router.route("/my").get(protect, getMyFeedback);

module.exports = router;