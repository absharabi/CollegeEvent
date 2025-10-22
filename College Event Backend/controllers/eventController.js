const { Event, User, Registration, Feedback } = require("../models");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer or Admin)
const createEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;

  if (!title || !description || !date || !location || !category) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      created_by: req.user.id, // Comes from the 'protect' middleware
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["date", "ASC"]],
      include: { model: User, as: "creator", attributes: ["name"] },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get all feedback for an event
// @route   GET /api/events/:id/feedback
// @access  Private (Organizer or Admin)
const getEventFeedback = async (req, res) => {
  try {
    const eventId = req.params.id;
    const feedback = await Feedback.findAll({
      where: { event_id: eventId },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
      ],
      order: [["submitted_at", "DESC"]],
    });

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Server error while fetching feedback." });
  }
};

// @desc    Get all registrations for an event
// @route   GET /api/events/:id/registrations
// @access  Private (Organizer or Admin)
const getEventRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId, {
      attributes: ["id", "title"],
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const registrations = await Registration.findAll({
      where: { event_id: eventId },
      include: [
        { model: User, attributes: ["id", "name", "email", "role"] },
      ],
      order: [["registration_date", "ASC"]],
    });

    res.status(200).json({ event, registrations });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching registrations" });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer or Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Optional: Check if the user is the creator or an admin
    if (event.created_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "User not authorized" });
    }
    const updatedEvent = await event.update(req.body);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer or Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Optional: Check if the user is the creator or an admin
    if (event.created_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "User not authorized" });
    }
    await event.destroy();
    res.status(200).json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getEventFeedback,
  getEventRegistrations,
  updateEvent,
  deleteEvent,
};