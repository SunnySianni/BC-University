import express from 'express';
import { Payment, Student } from '../models';

const router = express.Router();

// Add a payment for a student
router.post("/", async (req, res) => {
    try {
        const { student_id, amount, payment_date } = req.body;

        if (!student_id || !amount || !payment_date) {
            return res.status(400).json({
                error: "Student ID, amount, and payment date are required"
            });
        }

        const payment = await Payment.create({
            student_id,
            amount,
            payment_date
        });

        res.status(201).json({
            message: "Payment added successfully",
            payment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all payments for a specific student
router.get("/payment/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        const payments = await Payment.findAll({
            where: { student_id: studentId },
            include: [{
                model: Student,
                attributes: ['name', 'email']
            }]
        });

        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update payment details
router.put("/payment/:id", async (req, res) => {
    try {
        const { amount, payment_date } = req.body;
        const { id } = req.params;

        if (!amount || !payment_date) {
            return res.status(400).json({
                error: "Amount and payment date are required"
            });
        }

        const [updated] = await Payment.update(
            { amount, payment_date },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({
                error: "Payment not found"
            });
        }

        res.json({ message: "Payment updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a payment record
router.delete("/payment/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Payment.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({
                error: "Payment not found"
            });
        }

        res.json({ message: "Payment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
