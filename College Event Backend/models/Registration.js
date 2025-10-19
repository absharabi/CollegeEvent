// models/Registration.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Registration = sequelize.define("Registration", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "Registrations",
  timestamps: false
});

module.exports = Registration;
