const { Registration, Event, User } = require("../models");

// Register a user for an event
exports.registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if user already registered
    const existing = await Registration.findOne({ where: { userId, eventId } });
    if (existing) return res.status(400).json({ error: "Already registered for this event" });

    // Create new registration
    await Registration.create({ userId, eventId });
    res.status(201).json({ message: "Event registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Get all registrations for a user
exports.getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await Registration.findAll({
      where: { userId },
      include: [{ model: Event, as: "event" }]
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
};

// Get all attendees for a specific event
exports.getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const attendees = await Registration.findAll({
      where: { eventId },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }]
    });
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendees" });
  }
};
