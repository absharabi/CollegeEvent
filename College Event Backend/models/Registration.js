const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Registration = sequelize.define(
  "Registration",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // user_id and event_id are foreign keys automatically added by Sequelize
    // through the User.belongsToMany(Event, { through: Registration }) association
    // in your models/index.js file.
  },
  {
    tableName: "registrations",
    timestamps: true,
    updatedAt: false,
    createdAt: "registration_date",
  }
);

module.exports = Registration;