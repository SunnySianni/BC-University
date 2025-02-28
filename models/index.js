"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

import express from "express";
import { addCourse, deleteCourse } from "./services/courseService.js";
import Course from "./models/course.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Route to display courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.render("courses/courses", { title: "Courses", courses });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
});

// Route to add a course
app.post("/courses", async (req, res) => {
  const { name, code } = req.body;
  try {
    await addCourse(name, code);
    res.redirect("/courses");
  } catch (error) {
    res.status(500).json({ error: "Failed to add course" });
  }
});

// Route to delete a course
app.post("/courses/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCourse(id);
    res.redirect("/courses");
  } catch (error) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
