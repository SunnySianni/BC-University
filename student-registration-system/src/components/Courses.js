import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [schedule, setSchedule] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Error fetching courses');
            }
        };
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!courseName || !schedule) {
            setError('Course name and schedule are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/courses', { course_name: courseName, schedule });
            setCourses([...courses, response.data.course]);
            setSuccess('Course added successfully');
            setCourseName('');
            setSchedule('');
        } catch (err) {
            setError('Error adding course');
        }
    };

    return (
        <div>
            <h2>Courses</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                <input type="text" placeholder="Schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
                <button type="submit">Add Course</button>
            </form>

            <div>
                <h3>Course List</h3>
                {courses.map(course => (
                    <div key={course.id}>
                        <span>{course.course_name} - {course.schedule}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
