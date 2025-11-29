const { Feedback, User, Event, Registration } = require("../models/index");

// @desc    Submit feedback for an event
// @route   POST /api/feedback
// @access  Private/Student
const submitFeedback = async (req, res) => {
  const { eventId, rating, comments } = req.body;
  const userId = req.user.id;

  try {
    // Check if user is registered for the event
    const registration = await Registration.findOne({
      where: { user_id: userId, event_id: eventId },
    });

    if (!registration) {
      return res.status(403).json({ error: "You must be registered for the event to leave feedback." });
    }

    // 2. Check if the event has already passed
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    if (new Date(event.date) > new Date()) {
      return res.status(400).json({ error: "You can only leave feedback for past events." });
    }

    // Check if feedback already exists for this user and event
    const existingFeedback = await Feedback.findOne({
      where: { user_id: userId, event_id: eventId },
    });

    if (existingFeedback) {
      return res.status(400).json({ error: "You have already submitted feedback for this event." });
    }

    const feedback = await Feedback.create({
      user_id: userId,
      event_id: eventId,
      rating,
      comments,
    });
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get feedback submitted by the logged-in user
// @route   GET /api/feedback/my
// @access  Private/Student
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'rating', 'comments', 'event_id', 'createdAt'], // Include event_id directly
      include: [{ model: Event, as: "Event", attributes: ["id", "title"] }],
    });
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get all feedback for a specific event (Admin/Organizer)
// @route   GET /api/feedback/event/:eventId
// @access  Private/Admin
const getEventFeedback = async (req, res) => {
  const { eventId } = req.params;
  try {
    const feedback = await Feedback.findAll({
      where: { event_id: eventId },
      include: [{ model: User, as: "User", attributes: ["id", "name", "email"] }],
    });
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching event feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getEventFeedback,
};