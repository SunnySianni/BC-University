const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const db = require("./db");

const app = express();

// CORS configuration to allow only frontend requests from localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());  // Middleware to parse JSON data

// Fetch all students with pagination
app.get("/students", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    db.query("SELECT COUNT(*) AS total FROM students", (err, countResult) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const totalCount = countResult[0].total;
        const totalPages = Math.ceil(totalCount / limit);

        db.query(
            "SELECT * FROM students LIMIT ? OFFSET ?",
            [limit, offset],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    students: result,
                    totalPages: totalPages,
                });
            }
        );
    });
});

// Add a new student
app.post("/students", (req, res) => {
    const { name, email, age, course_id } = req.body;

    // Log the request body for debugging
    console.log(req.body);

    if (!name || !email || !age || !course_id) {
        return res.status(400).json({ error: "Name, email, age, and course are required" });
    }

    // Check if the course_id exists in the courses table
    db.query("SELECT * FROM courses WHERE id = ?", [course_id], (err, courseResult) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (courseResult.length === 0) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        // Insert student data
        db.query(
            "INSERT INTO students (name, email, age, enrollment_status) VALUES (?, ?, ?, 'Pending')",
            [name, email, age],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Insert enrollment data
                db.query(
                    "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
                    [result.insertId, course_id],
                    (err, enrollmentResult) => {
                        if (err) {
                            return res.status(500).json({ error: "Enrollment failed: " + err.message });
                        }
                        res.status(201).json({
                            message: "Student added and enrolled successfully",
                            student: { id: result.insertId, name, email, age, course_id },
                        });
                    }
                );
            }
        );
    });
});

// Add a payment for a student
app.post("/payments", (req, res) => {
    const { student_id, amount, payment_date } = req.body;

    if (!student_id || !amount || !payment_date) {
        return res.status(400).json({ error: "Student ID, amount, and payment date are required" });
    }

    db.query(
        "INSERT INTO payments (student_id, amount, payment_date) VALUES (?, ?, ?)",
        [student_id, amount, payment_date],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: "Payment added successfully",
                payment: { id: result.insertId, student_id, amount, payment_date }
            });
        }
    );
});

// Get all payments for a specific student by student ID
app.get("/api/payments/:studentId", (req, res) => {
    const studentId = req.params.studentId;

    db.query(
        "SELECT * FROM payments WHERE student_id = ?",
        [studentId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(result);
        }
    );
});

// Update payment details
app.put("/payments/:id", (req, res) => {
    const { amount, payment_date } = req.body;
    const paymentId = req.params.id;

    if (!amount || !payment_date) {
        return res.status(400).json({ error: "Amount and payment date are required" });
    }

    db.query(
        "UPDATE payments SET amount = ?, payment_date = ? WHERE id = ?",
        [amount, payment_date, paymentId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Payment updated successfully" });
        }
    );
});

// Delete a payment record
app.delete("/payments/:id", (req, res) => {
    const paymentId = req.params.id;

    db.query("DELETE FROM payments WHERE id = ?", [paymentId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Payment deleted successfully" });
    });
});

// Fetch all courses
app.get("/courses", (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
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
    db.query(
        "INSERT INTO courses (course_name, schedule) VALUES (?, ?)",
        [course_name, schedule],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: "Course added successfully",
                course: { id: result.insertId, course_name, schedule }
            });
        }
    );
});

// Enroll student in a course
app.post("/enroll", (req, res) => {
    const { student_id, course_id } = req.body;
    if (!student_id || !course_id) {
        return res.status(400).json({ error: "Student ID and Course ID are required" });
    }
    db.query(
        "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
        [student_id, course_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: "Student enrolled in course successfully",
                enrollment: { student_id, course_id }
            });
        }
    );
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
