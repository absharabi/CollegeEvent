const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.ENUM("Sports","Tech","Cultural"), allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Event;
