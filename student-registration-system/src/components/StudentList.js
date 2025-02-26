import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: '', email: '', age: '' });
  const [error, setError] = useState(null); // State to handle errors

  // Fetch student data from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/students')
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching students. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Handle deleting a student
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      axios
        .delete(`http://localhost:5000/students/${id}`)
        .then(() => {
          setStudents(students.filter((student) => student.id !== id));
        })
        .catch((error) => {
          setError('Error deleting student. Please try again later.');
        });
    }
  };

  // Handle starting the edit process
  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setUpdatedData({ name: student.name, email: student.email, age: student.age });
    setError(null); // Clear any previous errors
  };

  // Handle updating a student
  const handleUpdate = (id) => {
    if (!updatedData.name || !updatedData.email || !updatedData.age) {
      setError('All fields are required to update the student.');
      return;
    }

    axios
      .put(`http://localhost:5000/students/${id}`, updatedData)
      .then(() => {
        setStudents(students.map((student) => 
          student.id === id ? { ...student, ...updatedData } : student
        ));
        setEditingStudent(null);
        setError(null); // Clear error on success
      })
      .catch((error) => {
        setError('Error updating student. Please try again later.');
      });
  };

  if (loading) {
    return <p>Loading students...</p>;
  }

  return (
    <div>
      <h2>Student List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
      {students.length === 0 ? (
        <p>No students available.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {editingStudent === student.id ? (
                <>
                  <input 
                    type="text" 
                    value={updatedData.name} 
                    onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })} 
                  />
                  <input 
                    type="email" 
                    value={updatedData.email} 
                    onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })} 
                  />
                  <input 
                    type="number" 
                    value={updatedData.age} 
                    onChange={(e) => setUpdatedData({ ...updatedData, age: e.target.value })} 
                  />
                  <button onClick={() => handleUpdate(student.id)}>Save</button>
                  <button onClick={() => setEditingStudent(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{student.name} - {student.email} - {student.age} years old</span>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentList;
