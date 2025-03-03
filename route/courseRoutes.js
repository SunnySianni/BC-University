import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// View all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.render('course', { 
            title: 'Available Courses',
            courses: courses
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new course
router.post('/', async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.redirect('/courses');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add sample courses (temporary route)
router.get('/add-samples', async (req, res) => {
    try {
        const sampleCourses = [
            { course_name: 'Introduction to Computer Science', schedule: 'Monday/Wednesday 9:00 AM' },
            { course_name: 'Advanced Mathematics', schedule: 'Tuesday/Thursday 2:00 PM' },
            { course_name: 'English Literature', schedule: 'Monday/Wednesday 1:00 PM' },
            { course_name: 'Physics 101', schedule: 'Tuesday/Thursday 10:00 AM' },
            { course_name: 'World History', schedule: 'Friday 9:00 AM' }
        ];

        await Course.bulkCreate(sampleCourses);
        res.redirect('/courses');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;