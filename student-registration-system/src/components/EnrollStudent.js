import React, { useState } from "react";
import axios from "axios";

const EnrollStudent = () => {
    const [student_id, setStudentId] = useState("");
    const [course_id, setCourseId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleEnrollStudent = async () => {
        setError("");
        setSuccess("");

        if (!student_id || !course_id) {
            setError("Both Student ID and Course ID are required.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/enrollments", {
                student_id,
                course_id
            });
            setSuccess(response.data.message);
            setStudentId("");
            setCourseId("");
        } catch (error) {
            console.error("Error enrolling student:", error);
            setError("Error enrolling student. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enroll-container">
            <h2>Enroll Student in Course</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="form-group">
                <input
                    type="number"
                    placeholder="Student ID"
                    value={student_id}
                    onChange={(e) => setStudentId(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="number"
                    placeholder="Course ID"
                    value={course_id}
                    onChange={(e) => setCourseId(e.target.value)}
                />
            </div>
            <button onClick={handleEnrollStudent} disabled={loading}>
                {loading ? "Enrolling..." : "Enroll Student"}
            </button>
        </div>
    );
};

export default EnrollStudent;
