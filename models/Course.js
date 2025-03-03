// models/Course.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schedule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'courses',
    timestamps: false,  // Disable createdAt/updatedAt columns
});

// Instead of importing Student directly, you reference it as a string (which will be resolved later)
Course.associate = (models) => {
    Course.belongsToMany(models.Student, { through: 'enrollments' });
};

export default Course;
