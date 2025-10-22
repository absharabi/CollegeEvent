const sequelize = require("../config/db");
const User = require("./User");
const Event = require("./Event");
const Registration = require("./Registration");
const Feedback = require("./Feedback");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Event = Event;
db.Registration = Registration;
db.Feedback = Feedback;

// --- Define Associations ---

// 1. User has many Events (as a creator)
User.hasMany(Event, {
  foreignKey: "created_by",
  onDelete: "SET NULL",
});
Event.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

// 2. Many-to-Many: Users <-> Events (through Registrations)
User.belongsToMany(Event, { through: Registration, foreignKey: "user_id" });
Event.belongsToMany(User, { through: Registration, foreignKey: "event_id" });

// 3. One-to-Many: A User can give Feedback for many Events
//    One-to-Many: An Event can have Feedback from many Users
User.hasMany(Feedback, { foreignKey: "user_id", onDelete: "CASCADE" });
Feedback.belongsTo(User, { foreignKey: "user_id" });

Event.hasMany(Feedback, { foreignKey: "event_id", onDelete: "CASCADE" });
Feedback.belongsTo(Event, { foreignKey: "event_id" });

module.exports = db;