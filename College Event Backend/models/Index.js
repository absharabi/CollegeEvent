const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Event = require("./Event");

// ✅ New models
const Registration = sequelize.define("Registration", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Feedback = sequelize.define("Feedback", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comments: { type: DataTypes.TEXT }
});

// 🧱 ASSOCIATIONS

// 1️⃣ One-to-many: User -> Event (Creator)
User.hasMany(Event, { foreignKey: "createdBy", as: "events" });
Event.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// 2️⃣ Many-to-many: User <-> Event (Registrations)
User.belongsToMany(Event, { through: Registration, as: "registeredEvents" });
Event.belongsToMany(User, { through: Registration, as: "attendees" });

// 3️⃣ One-to-many: Event -> Feedback
Event.hasMany(Feedback, { foreignKey: "eventId", as: "feedbacks" });
Feedback.belongsTo(Event, { foreignKey: "eventId", as: "event" });

// 4️⃣ One-to-many: User -> Feedback
User.hasMany(Feedback, { foreignKey: "userId", as: "userFeedbacks" });
Feedback.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { sequelize, User, Event, Registration, Feedback };
