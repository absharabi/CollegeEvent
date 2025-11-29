const { Event, User, Registration } = require("../models/index");
const { Op } = require("sequelize");

// @desc    Get dashboard summary statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.count();
    const totalUsers = await User.count({ where: { role: "student" } });
    const totalRegistrations = await Registration.count();

    const upcomingEventsCount = await Event.count({
      where: {
        date: {
          [Op.gte]: new Date(),
        },
      },
    });

    res.status(200).json({
      totalEvents,
      totalUsers,
      totalRegistrations,
      upcomingEventsCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Server error while fetching stats." });
  }
};