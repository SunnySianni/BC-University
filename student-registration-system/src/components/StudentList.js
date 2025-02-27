import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentList = () => {
    const [students, setStudents] = useState([]); // Store students data
    const [editingStudent, setEditingStudent] = useState(null); // To handle editing
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
    const [error, setError] = useState(''); // Error message state
    const [loading, setLoading] = useState(false); // Loading state for async actions

    // Fetch students on page change
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/students?page=${currentPage}`);
                setStudents(response.data.students);
                setTotalPages(response.data.totalPages); // Assuming backend provides total pages
            } catch (err) {
                setError('Error fetching students');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [currentPage]); // Re-fetch students when page changes

    // Handle changes in the edit form
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    // Handle student update
    const handleUpdate = async () => {
        if (!editingStudent.name || !editingStudent.email || !editingStudent.age || !editingStudent.course) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            await axios.put(`http://localhost:5000/students/${editingStudent.id}`, editingStudent);
            setEditingStudent(null); // Clear the edit form after update
            setError('');
            // Refresh the student list or notify success
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === editingStudent.id ? editingStudent : student
                )
            );
        } catch (err) {
            setError("Error updating student");
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <h2>Student List</h2>

            {/* Error message */}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* Loading state */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                // Check if students array is valid before rendering
                Array.isArray(students) && students.length > 0 ? (
                    students.map((student) => (
                        <div key={student.id} style={{ marginBottom: "15px" }}>
                            <span>{student.name} - {student.email} - {student.age} - {student.course}</span>
                            <button onClick={() => setEditingStudent(student)} style={{ marginLeft: "10px" }}>
                                Edit
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No students found</div>
                )
            )}

            {/* Pagination controls */}
            <div>
                {/* Display page buttons */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* Edit student form */}
            {editingStudent && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Edit Student</h3>
                    <input
                        type="text"
                        name="name"
                        value={editingStudent.name}
                        onChange={handleEditChange}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={editingStudent.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="number"
                        name="age"
                        value={editingStudent.age}
                        onChange={handleEditChange}
                        placeholder="Age"
                        required
                    />
                    <input
                        type="text"
                        name="course"
                        value={editingStudent.course}
                        onChange={handleEditChange}
                        placeholder="Course"
                        required
                    />
                    <button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Student"}
                    </button>
                    <button onClick={() => setEditingStudent(null)} style={{ marginLeft: "10px" }}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentList;
