import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch all courses
        axios.get('http://localhost:5000/courses')  // Update the API endpoint to match your backend
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching courses!', error);
            });
    }, []);

    return (
        <div>
            <h2>Courses List</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        {course.course_name} - {course.schedule}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Courses;
