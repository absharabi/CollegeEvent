const { Feedback, Registration } = require("../models");

// @desc    Create new feedback for an event
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
  const { eventId, rating, comment } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!eventId || !rating) {
    return res.status(400).json({ error: "Event ID and rating are required." });
  }

  try {
    // 1. Verify the user is registered for the event
    const registration = await Registration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
      },
    });

    if (!registration) {
      return res
        .status(403)
        .json({ error: "You must be registered for an event to leave feedback." });
    }

    // 2. Check if feedback already exists (the DB has a unique constraint, but this provides a friendlier error)
    const existingFeedback = await Feedback.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
      },
    });

    if (existingFeedback) {
      return res.status(400).json({ error: "You have already submitted feedback for this event." });
    }

    // 3. Create the feedback
    const feedback = await Feedback.create({
      user_id: userId,
      event_id: eventId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ error: "Server error while creating feedback." });
  }
};

// @desc    Get all feedback submitted by the logged-in user
// @route   GET /api/feedback/my
// @access  Private
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { user_id: req.user.id },
      attributes: ["eventId"], // We only need the eventId to check for existence
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching your feedback." });
  }
};

module.exports = { createFeedback, getMyFeedback };