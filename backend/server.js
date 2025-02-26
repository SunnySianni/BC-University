require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Importing the database connection

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

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
