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

export const associateCourse = (models) => {
    Course.belongsToMany(models.Student, { through: 'Enrollment', foreignKey: 'course_id' });
};

export default Course;
