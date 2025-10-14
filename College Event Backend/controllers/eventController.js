const { Event, User } = require("../models");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Event creation failed" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, as: "creator", attributes: ["id","name"] }]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Fetching events failed" });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await event.addAttendee(req.user.id); // Many-to-many
    res.json({ message: "Registered for event" });
  } catch (error) {
    res.status(500).json({ error: "Event registration failed" });
  }
};
