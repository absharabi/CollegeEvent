const { Feedback, Event, User } = require("../models");

// Submit feedback for an event
exports.submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comments } = req.body;
    const userId = req.user.id;

    // Check event exists
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if user already submitted feedback
    const existingFeedback = await Feedback.findOne({ where: { userId, eventId } });
    if (existingFeedback) return res.status(400).json({ error: "Feedback already submitted" });

    const feedback = await Feedback.create({ userId, eventId, rating, comments });
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

// Get feedback for a specific event
exports.getEventFeedback = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const feedbacks = await Feedback.findAll({
      where: { eventId },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }]
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

// Get all feedbacks given by the logged-in user
exports.getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbacks = await Feedback.findAll({
      where: { userId },
      include: [{ model: Event, as: "event", attributes: ["id", "title"] }]
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user feedback" });
  }
};
