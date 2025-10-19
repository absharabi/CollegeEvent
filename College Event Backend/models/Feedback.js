// models/Feedback.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Feedback = sequelize.define("Feedback", {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "Feedback",
  timestamps: true
});

module.exports = Feedback;
