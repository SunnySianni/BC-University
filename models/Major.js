import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Major = sequelize.define("Major", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Major;