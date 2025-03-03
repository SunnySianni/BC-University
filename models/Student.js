// models/Student.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enrollment_status: {
        type: DataTypes.ENUM('Enrolled', 'Pending', 'Graduated'),
        defaultValue: 'Pending',
    },
}, {
    tableName: 'students',
    timestamps: false,  // Disable createdAt/updatedAt columns
});

// Instead of importing Course directly, you reference it as a string (which will be resolved later)
Student.associate = (models) => {
    Student.belongsToMany(models.Course, { through: 'enrollments' });
};

export default Student;
