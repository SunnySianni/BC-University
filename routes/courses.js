import express from 'express';
import { Course, Enrollment } from '../models';

const router = express.Router();

// Fetch all courses
router.get("/", async (req, res) => {

    try {
        const courses = await Course.findAll();
        res.render('courses', { courses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new course
router.post("/add-course", async (req, res) => {

    const { course_name, schedule } = req.body;

    if (!course_name || !schedule) {
        return res.status(400).json({ error: "Course name and schedule are required" });
    }

    try {
        const newCourse = await Course.create({
            course_name,
            schedule
        });

        res.status(201).json({
            message: "Course added successfully",
            course: newCourse
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll student in a course
router.post("/enroll", async (req, res) => {

    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
        return res.status(400).json({ error: "Student ID and Course ID are required" });
    }

    try {
        const newEnrollment = await Enrollment.create({
            student_id,
            course_id
        });

        res.status(201).json({
            message: "Student enrolled in course successfully",
            enrollment: newEnrollment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;