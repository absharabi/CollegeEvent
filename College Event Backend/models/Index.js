const Sequelize = require("sequelize");
const { sequelize } = require("../config/db"); // Your database connection

// Import models
const User = require("./User")(sequelize, Sequelize);
const Event = require("./Event")(sequelize, Sequelize);
const Registration = require("./Registration")(sequelize, Sequelize);
const Feedback = require("./Feedback")(sequelize, Sequelize);

// Define Associations

// User and Event (Organizer)
// A User can organize many Events
// An Event is organized by one User
User.hasMany(Event, { foreignKey: "organizer_id", as: "OrganizedEvents" });
Event.belongsTo(User, { foreignKey: "organizer_id", as: "Organizer" });

// User and Registration
// A User can have many Registrations
// A Registration belongs to one User
User.hasMany(Registration, { foreignKey: "user_id", as: "Registrations" });
Registration.belongsTo(User, { foreignKey: "user_id", as: "User" });

// Event and Registration
// An Event can have many Registrations
// A Registration belongs to one Event
Event.hasMany(Registration, { foreignKey: "event_id", as: "Registrations" });
Registration.belongsTo(Event, { foreignKey: "event_id", as: "Event" });

// User and Feedback
// A User can give many Feedbacks
// A Feedback belongs to one User
User.hasMany(Feedback, { foreignKey: "user_id", as: "Feedback" });
Feedback.belongsTo(User, { foreignKey: "user_id", as: "User" });

// Event and Feedback
// An Event can receive many Feedbacks
// A Feedback belongs to one Event
Event.hasMany(Feedback, { foreignKey: "event_id", as: "Feedback" });
Feedback.belongsTo(Event, { foreignKey: "event_id", as: "Event" });

// Export models and sequelize instance
const db = {
  sequelize,
  Sequelize,
  User,
  Event,
  Registration,
  Feedback,
};

// Optional: Sync all models with the database
// This will create tables if they don't exist
// db.sequelize.sync({ force: false }) // Use { force: true } only in development to drop and re-create tables
//   .then(() => console.log("Database & tables created!"))
//   .catch(err => console.error("Error syncing database:", err));

module.exports = db;