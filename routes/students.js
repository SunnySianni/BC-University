import express from 'express';
import { Student, Course, Enrollment } from '../models';

const router = express.Router();

// Fetch all students with pagination
router.get("/", async (req, res) => {

    try {
       
        // Get total count and students with pagination
        const { count: totalCount, rows: students } = await Student.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });

        res.json({
            students,
            totalPages,
        });

    } catch (err) {

        res.status(500).json({ error: err.message });
    }
});

// Add a new student
router.post("/add-student", async (req, res) => {

    try {
        
        const { name, email, age, course_id } = req.body;

        console.log(req.body);

        if (!name || !email || !age || !course_id) {
            return res.status(400).json({
                error: "Name, email, age, and course are required"
            });
        }

        // Check if course exists
        const course = await Course.findByPk(course_id);

        if (!course) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        // Create student with transaction
        const student = await Student.create({
            name,
            email,
            age,
            enrollment_status: 'Pending'
        });

        // Create enrollment
        await Enrollment.create({
            student_id: student.id,
            course_id
        });

        res.status(201).json({
            message: "Student added and enrolled successfully",
            student: {
                id: student.id,
                name,
                email,
                age,
                course_id
            },
        });
    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});

export default router;