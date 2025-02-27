import React, { useState } from "react";
import axios from "axios";

const EnrollStudent = () => {
    const [student_id, setStudentId] = useState("");
    const [course_id, setCourseId] = useState("");

    const handleEnrollStudent = async () => {
        try {
            const response = await axios.post("http://localhost:5000/enrollments", {
                student_id,
                course_id
            });
            alert(response.data.message);
            setStudentId("");
            setCourseId("");
        } catch (error) {
            console.error("Error enrolling student:", error);
            alert("Error enrolling student");
        }
    };

    return (
        <div>
            <h2>Enroll Student in Course</h2>
            <input
                type="number"
                placeholder="Student ID"
                value={student_id}
                onChange={(e) => setStudentId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Course ID"
                value={course_id}
                onChange={(e) => setCourseId(e.target.value)}
            />
            <button onClick={handleEnrollStudent}>Enroll Student</button>
        </div>
    );
};

export default EnrollStudent;
