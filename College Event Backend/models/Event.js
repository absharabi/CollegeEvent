const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Sports", "Tech", "Cultural"),
      allowNull: false,
    },
    // created_by is defined by the association in models/index.js
  },
  {
    tableName: "events",
    timestamps: true,
    updatedAt: false,
    createdAt: "created_at",
  }
);

module.exports = Event;