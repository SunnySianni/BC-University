import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [studentId, setStudentId] = useState('');

    // Fetch payments for a specific student
    useEffect(() => {
        if (studentId) {
            axios.get(`/api/payments/${studentId}`)
                .then(response => {
                    setPayments(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching payments!', error);
                });
        }
    }, [studentId]);

    const handleDeletePayment = (id) => {
        axios.delete(`/api/payments/${id}`)
            .then(response => {
                setPayments(payments.filter(payment => payment.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the payment!', error);
            });
    };

    return (
        <div>
            <h2>Payments List</h2>

            {/* Student ID input to fetch payments for a specific student */}
            <div>
                <input
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <button onClick={() => setStudentId(studentId)}>Fetch Payments</button>
            </div>

            <ul>
                {payments.length > 0 ? (
                    payments.map(payment => (
                        <li key={payment.id}>
                            Student ID: {payment.student_id} - Amount: {payment.amount} - Date: {payment.payment_date}
                            <button onClick={() => handleDeletePayment(payment.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <li>No payments found for this student.</li>
                )}
            </ul>
        </div>
    );
};

export default Payments;
