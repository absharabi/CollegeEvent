const User = require("./User");
const Event = require("./Event");

// One-to-many: User -> Event (creator)
User.hasMany(Event, { foreignKey: "createdBy", as: "events" });
Event.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Many-to-many: User <-> Event (attendees)
User.belongsToMany(Event, { through: "EventAttendees", as: "registeredEvents" });
Event.belongsToMany(User, { through: "EventAttendees", as: "attendees" });

module.exports = { User, Event };
