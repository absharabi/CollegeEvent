const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // user_id and event_id are defined by the association in models/index.js
    comment: {
      type: DataTypes.TEXT,
      allowNull: true, // Or false if it's required
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true, // Or false if it's required
      validate: {
        min: 0.5,
        max: 5,
      },
    },
  },
  {
    tableName: "feedback",
    timestamps: true,
    updatedAt: false,
    createdAt: "submitted_at",
  }
);

module.exports = Feedback;