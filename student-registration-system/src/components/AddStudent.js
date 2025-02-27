import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStudent = ({ onStudentAdded }) => {
    const [student, setStudent] = useState({
        name: '',
        email: '',
        age: '',
        course_id: '', // Store selected course_id
    });

    const [courses, setCourses] = useState([]); // Store available courses
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch available courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/courses");
                setCourses(response.data); // Store available courses in state
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses");
            }
        };
        fetchCourses();
    }, []);

    // Handle input changes for student data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    // Handle form submission to add student
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Only submit if student information is fully provided
        if (!student.name || !student.email || !student.age || !student.course_id) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            // Send POST request to add student
            await axios.post("http://localhost:5000/students", student);
            setStudent({ name: '', email: '', age: '', course_id: '' }); // Reset form after submission
            setSuccess("Student added successfully!");

            // After adding a student, fetch the updated list of students
            if (onStudentAdded) {
                onStudentAdded(); // Call the parent method to refresh the student list
            }

        } catch (error) {
            setError(error.response?.data?.error || "Failed to add student");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Add Student</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={student.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={student.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={student.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="course_id">Course:</label>
                    <select
                        id="course_id"
                        name="course_id"
                        value={student.course_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.course_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Student"}
                </button>
            </form>
        </div>
    );
};

export default AddStudent;
