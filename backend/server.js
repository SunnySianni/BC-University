require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const db = require('./db'); 


const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON data


// Fetch all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(result);
    });
});

// Add a new student
app.post("/students", (req, res) => {
    const { name, email, age, course } = req.body;

    if (!name || !email || !age || !course) {
        return res.status(400).json({ error: "Name, email, age, and course are required" });
    }

    const query = "INSERT INTO students (name, email, age, course, enrollment_status) VALUES (?, ?, ?, ?, 'Pending')";
    db.query(query, [name, email, age, course], (err, result) => {
        if (err) {
            console.error('Error inserting student:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: "Student added successfully",
            student: { id: result.insertId, name, email, age, course }
        });
    });
});

// Update student details
app.put("/students/:id", (req, res) => {
    const { name, email, age, course } = req.body;
    const studentId = req.params.id;

    if (!name || !email || !age || !course) {
        return res.status(400).json({ error: "Name, email, age, and course are required" });
    }

    db.query(
        "UPDATE students SET name = ?, email = ?, age = ?, course = ? WHERE id = ?",
        [name, email, age, course, studentId],
        (err, result) => {
            if (err) {
                console.error('Error updating student:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Student updated successfully" });
        }
    );
});

// Delete a student
app.delete("/students/:id", (req, res) => {
    const studentId = req.params.id;

    db.query("DELETE FROM students WHERE id = ?", [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Student deleted successfully" });
    });
});

// Fetch all courses
app.get("/courses", (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(result);
    });
});

// Add a new course
app.post("/courses", (req, res) => {
    const { course_name, schedule } = req.body;

    if (!course_name || !schedule) {
        return res.status(400).json({ error: "Course name and schedule are required" });
    }

    const query = "INSERT INTO courses (course_name, schedule) VALUES (?, ?)";
    db.query(query, [course_name, schedule], (err, result) => {
        if (err) {
            console.error('Error inserting course:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: "Course added successfully",
            course: { id: result.insertId, course_name, schedule }
        });
    });
});

// Enroll student in a course
app.post("/enroll", (req, res) => {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
        return res.status(400).json({ error: "Student ID and Course ID are required" });
    }

    const query = "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)";
    db.query(query, [student_id, course_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: "Student enrolled in course successfully",
            enrollment: { student_id, course_id }
        });
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
