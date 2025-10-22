const { Registration, Event } = require("../models");

// @desc    Register user for an event
// @route   POST /api/registration/register
// @access  Private
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const existingRegistration = await Registration.findOne({
      where: { user_id: userId, event_id: eventId },
    });

    if (existingRegistration) {
      return res.status(400).json({ error: "Already registered for this event" });
    }

    const registration = await Registration.create({
      user_id: userId,
      event_id: eventId,
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get registrations for the logged-in user
// @route   GET /api/registration/my
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Event, attributes: ["id", "title", "date"] }],
    });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerForEvent, getMyRegistrations };