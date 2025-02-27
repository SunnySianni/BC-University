import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests

const AddCourse = () => {
    const [courseName, setCourseName] = useState("");
    const [schedule, setSchedule] = useState("");
    const [message, setMessage] = useState("");  // For showing success or error messages

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent page reload

        // Data to be sent to the server
        const courseData = {
            course_name: courseName,
            schedule: schedule,
        };

        // Make a POST request to add the course
        axios
            .post("http://localhost:5000/courses", courseData)
            .then((response) => {
                setMessage("Course added successfully!");
                setCourseName("");  // Clear input fields after successful submission
                setSchedule("");
            })
            .catch((error) => {
                setMessage("Failed to add course. Please try again.");
                console.error("Error adding course:", error);
            });
    };

    return (
        <div>
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Course Name:</label>
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Schedule:</label>
                    <input
                        type="text"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Course</button>
            </form>
            {message && <p>{message}</p>} {/* Display success/error message */}
        </div>
    );
};

export default AddCourse;
