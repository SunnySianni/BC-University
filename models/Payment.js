// models/Payment.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Student from './Student.js';  // Import the Student model

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'payments',
    timestamps: false,  // Disable createdAt/updatedAt columns
});

// Associations
Payment.belongsTo(Student, { foreignKey: 'student_id' });

export default Payment;
