import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js"; // Ensure this file exports a Sequelize instance

class Course extends Model {}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "Course",
    tableName: "Course",
    timestamps: true, // Automatically manages `created_at` & `updated_at`
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Course.associate = function (models) {
  // associations can be defined here
  Course.belongsToMany(models.Student, {
    through: "StudentCourses",
    as: "students",
    foreignKey: "courseId",
  });
};

export default Course;
