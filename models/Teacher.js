import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Teacher = sequelize.define("Teacher", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Teacher;