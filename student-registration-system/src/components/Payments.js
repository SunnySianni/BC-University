import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        // Fetch all payments
        axios.get('/api/payments')
            .then(response => {
                setPayments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching payments!', error);
            });
    }, []);

    return (
        <div>
            <h2>Payments List</h2>
            <ul>
                {payments.map(payment => (
                    <li key={payment.id}>Student ID: {payment.student_id} - Amount: {payment.amount} - Date: {payment.payment_date}</li>
                ))}
            </ul>
        </div>
    );
};

export default Payments;
