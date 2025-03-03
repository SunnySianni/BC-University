// models/Enrollment.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Student from './Student.js';  // Import the Student model
import Course from './course.js';    // Import the Course model

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'enrollments',
    timestamps: false,  // Disable createdAt/updatedAt columns
});

// Associations
Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

export default Enrollment;
