const express = require("express");
const { createEvent, getEvents, registerForEvent } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createEvent);
router.get("/all", getEvents);
router.post("/:id/register", authMiddleware, registerForEvent);

module.exports = router;
