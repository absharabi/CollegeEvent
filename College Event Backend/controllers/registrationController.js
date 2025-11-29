const { Registration, Event, User } = require("../models/index");

// @desc    Register user for an event
// @route   POST /api/registration/register
// @access  Private
const registerForEvent = async (req, res) => {
  const eventId = req.params.eventId;
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
      registration_date: new Date(), // Explicitly set the registration date
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.error("Error registering for event:", error);
  }
};

// @desc    Get registrations for the logged-in user
// @route   GET /api/registration/my
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Event, // Ensure Event model is correctly imported
          as: "Event",
          attributes: ["id", "title", "date", "description", "location", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get all certificate-eligible registrations for the logged-in user
// @route   GET /api/registration/my-certificates
// @access  Private
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Registration.findAll({
      where: {
        user_id: req.user.id,
        attended: true, // Only fetch where attendance is marked true
      },
      include: [
        { model: Event, as: "Event", attributes: ["id", "title", "date", "category"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Error fetching user certificates:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Student marks their own attendance
// @route   PUT /api/registration/mark-attended/:registrationId
// @access  Private/Student
const markMyAttendance = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findByPk(registrationId);

    // Security Check: Ensure the registration exists and belongs to the logged-in user
    if (!registration || registration.user_id !== userId) {
      return res.status(404).json({ error: "Registration not found or you are not authorized to change it." });
    }

    // Logic to only allow marking as attended, not un-marking
    if (registration.attended) {
      return res.status(400).json({ error: "Attendance already marked." });
    }

    registration.attended = true;
    await registration.save();

    res.status(200).json(registration);
  } catch (error) {
    console.error("Error marking own attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update attendance status for a registration
// @route   PUT /api/registrations/:id/attendance
// @access  Private/Admin
const updateAttendance = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.registrationId);

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // Toggle the 'attended' status
    registration.attended = !registration.attended;
    await registration.save();

    res.status(200).json(registration);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerForEvent, getMyRegistrations, updateAttendance, getMyCertificates, markMyAttendance };