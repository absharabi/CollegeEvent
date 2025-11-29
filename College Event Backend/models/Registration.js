module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define("Registration", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: { model: "Users", key: "id" },
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: { model: "Events", key: "id" },
    },
    attended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Registration;
};