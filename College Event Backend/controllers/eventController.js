// File: controllers/eventController.js
const { Event, Registration, User } = require("../models/index");
const { Op } = require("sequelize");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

// ======================= CREATE EVENT =======================
const createEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;

  if (!title || !description || !date || !location || !category) {
    return res.status(400).json({ error: "Missing required event fields." });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      organizer_id: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error while creating event." });
  }
};

// ======================= GET ALL EVENTS =======================
const getAllEvents = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const whereClause = {};

    if (categoryName) {
      whereClause.category = categoryName;
    }

    const events = await Event.findAll({
      where: whereClause,
      order: [["date", "DESC"]],
      include: [
        {
          model: User,
          as: "Organizer",
          attributes: ["name", "email"],
        },
      ],
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================= GET EVENT BY ID =======================
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================= UPDATE EVENT =======================
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await event.update(req.body);
    res.status(200).json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================= DELETE EVENT =======================
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================= GET EVENT REGISTRATIONS =======================
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const registrations = await Registration.findAll({
      where: { event_id: req.params.id },
      include: [{ model: User, as: "User", attributes: ["id", "name", "email"] }],
      order: [["registration_date", "DESC"]],
    });

    res.status(200).json({
      event: event,
      registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================= GENERATE CERTIFICATE =======================
const generateCertificate = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const registration = await Registration.findOne({
      where: { event_id: eventId, user_id: userId, attended: true },
      include: [
        { model: User, as: "User", attributes: ["name"] },
        { model: Event, as: "Event", attributes: ["title", "date"] },
      ],
    });

    if (!registration)
      return res.status(403).json({
        error:
          "Certificate not available. You must be registered and have attended the event.",
      });

    const templatePath = path.join(__dirname, "..", "assets", "certificate-template.pdf");
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page and its dimensions
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    const studentName = registration.User.name;
    const eventTitle = registration.Event.title;
    const eventDate = new Date(registration.Event.date).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // Calculate text widths to center them accurately
    const nameWidth = boldFont.widthOfTextAtSize(studentName, 30);
    const titleWidth = regularFont.widthOfTextAtSize(eventTitle, 22);

    // Draw the student's name (adjust Y coordinate as needed for your template)
    firstPage.drawText(studentName, {
      x: (width - nameWidth) / 2,
      y: height / 2 + 30,
      size: 30,
      font: boldFont,
      color: rgb(0.11, 0.21, 0.35),
    });

    // Draw the event title
    firstPage.drawText(eventTitle, {
      x: (width - titleWidth) / 2,
      y: height / 2 - 30,
      size: 22,
      font: regularFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Serialize the PDF to bytes and send it as a response
    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${eventTitle}.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ error: "Server error while generating certificate." });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  generateCertificate,
};
