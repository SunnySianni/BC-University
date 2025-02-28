import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Minor = sequelize.define("Minor", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Minor;