import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Define your student routes here
router.get('/', async (req, res) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get registration form
router.get('/add', (req, res) => {
    const message = req.query.message || '';
    res.render('addStudent', { 
        title: 'Register as Student',
        message: message 
    });
});

// Register new student
router.post('/', async (req, res) => {
    try {
        const student = await Student.create(req.body);
        // Create session for the student
        req.session.studentId = student.id;
        req.session.studentName = student.name;
        res.redirect('/courses');
    } catch (error) {
        let errorMessage = 'Registration failed: ';
        
        if (error.name === 'SequelizeValidationError') {
            errorMessage += error.errors[0].message;
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage += 'This email is already registered';
        } else {
            errorMessage += error.message;
        }
        
        res.render('addStudent', { 
            title: 'Register as Student',
            message: errorMessage
        });
    }
});

// Get student profile
router.get('/profile', async (req, res) => {
    if (!req.session.studentId) {
        return res.redirect('/students/add');
    }
    try {
        const student = await Student.findByPk(req.session.studentId);
        if (!student) {
            req.session.destroy();
            return res.redirect('/students/add');
        }
        res.render('studentProfile', { 
            title: 'Student Profile',
            student: student 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

export default router;