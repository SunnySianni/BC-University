// models/Student.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Course from './Course.js';  // Import the Course model

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name cannot be empty'
            },
            len: {
                args: [2, 50],
                msg: 'Name must be between 2 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'This email is already registered'
        },
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address'
            }
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'Age must be a number'
            },
            min: {
                args: [16],
                msg: 'Age must be at least 16'
            },
            max: {
                args: [100],
                msg: 'Age must be less than 100'
            }
        }
    },
    enrollment_status: {
        type: DataTypes.ENUM('Enrolled', 'Pending', 'Graduated'),
        defaultValue: 'Pending',
        validate: {
            isIn: {
                args: [['Enrolled', 'Pending', 'Graduated']],
                msg: 'Invalid enrollment status'
            }
        }
    },
}, {
    tableName: 'students',
    timestamps: false,  // Disable createdAt/updatedAt columns
});

export const associateStudent = (models) => {
    Student.belongsToMany(models.Course, { through: 'Enrollment', foreignKey: 'student_id' });
};

export default Student;
