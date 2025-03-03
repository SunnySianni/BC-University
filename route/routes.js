import express from 'express';
import Student from '../models/Student.js';
import Course from '../models/course.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Render the Add New Student form (GET /students/add)
router.get('/students/add', (req, res) => {
    res.render('addStudent');  // Render the addStudent.ejs form
});

// Create a new student (POST /students/add)
router.post('/students/add', async (req, res) => {
    try {
        const { name, email, age, enrollment_status } = req.body;
        const student = await Student.create({ name, email, age, enrollment_status });
        res.redirect('/students');  // Redirect to the list of students after adding the new student
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating student' });
    }
});

// Get all students (GET /students)
router.get('/students', async (req, res) => {
    try {
        const students = await Student.findAll();
        res.render('students', { students });  // Render the students.ejs file with student data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching students' });
    }
});

// Get a student by ID (GET /students/:id)
router.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student' });
    }
});

// Edit student (GET /students/edit/:id)
router.get('/students/edit/:id', async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.render('editStudent', { student });  // Render the editStudent.ejs with student data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student for editing' });
    }
});

// Update student (POST /students/edit/:id)
router.post('/students/edit/:id', async (req, res) => {
    try {
        const { name, email, age, enrollment_status } = req.body;
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        await student.update({ name, email, age, enrollment_status });
        res.redirect('/students');  // Redirect to the student list page after editing
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating student' });
    }
});

// Delete student (POST /students/delete/:id)
router.post('/students/delete/:id', async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        await student.destroy();
        res.redirect('/students');  // Redirect to the list of students after deleting the student
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting student' });
    }
});


// Get all courses (GET /courses)
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.render('courses', { courses, title: 'Course List' });  // Render the courses.ejs file with course data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Add a new course (POST /courses)
router.post('/courses', async (req, res) => {
    try {
        const { course_name, schedule } = req.body;
        await Course.create({ course_name, schedule });
        res.redirect('/courses');  // Redirect to the courses list page after adding
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding course' });
    }
});

// Edit a course (GET /courses/update-course/:id)
router.get('/courses/update-course/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.render('editCourse', { course, title: 'Edit Course' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching course for update' });
    }
});

// Update a course (POST /courses/update-course/:id)
router.post('/courses/update-course/:id', async (req, res) => {
    try {
        const { course_name, schedule } = req.body;
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).send('Course not found');
        }
        await course.update({ course_name, schedule });
        res.redirect('/courses');  // Redirect to the courses list page after updating
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating course' });
    }
});

// Delete a course (POST /courses/delete-course/:id)
router.post('/courses/delete-course/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).send('Course not found');
        }
        await course.destroy();
        res.redirect('/courses');  // Redirect to the courses list page after deleting
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting course' });
    }
});


// Enroll a student in a course (POST /enrollments)
router.post('/enrollments', async (req, res) => {
    try {
        const { student_id, course_id } = req.body;
        const enrollment = await Enrollment.create({ student_id, course_id });
        res.status(201).json(enrollment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error enrolling student in course' });
    }
});

// Create a payment (POST /payments)
router.post('/payments', async (req, res) => {
    try {
        const { student_id, amount, payment_date } = req.body;
        const payment = await Payment.create({ student_id, amount, payment_date });
        res.status(201).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating payment' });
    }
});

export default router;
