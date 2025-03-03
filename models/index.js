// models/index.js
"use strict";

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import sequelizeConfig from '../config/config.js';  // Adjusted import for config

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = sequelizeConfig[env];  // Accessing config from the correct source

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all files in the current directory (models) and import them
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      !file.includes('.test.js')
    );
  })
  .forEach((file) => {
    // Dynamically require each model
    const model = import(path.join(__dirname, file)).then((module) => module.default(sequelize, Sequelize.DataTypes));
    model.then((modelInstance) => {
      db[modelInstance.name] = modelInstance;
    });
  });

// After all models are imported, run associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize and Sequelize to the db object for later use
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
