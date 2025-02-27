import React, { useState } from 'react';
import axios from 'axios';

const AddPayment = () => {
    const [studentId, setStudentId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const paymentData = { student_id: studentId, amount, payment_date: paymentDate };

        // Send POST request to backend
        axios.post('http://localhost:5000/api/payments', paymentData)
            .then(response => {
                console.log('Payment added successfully:', response.data);
                // Optionally reset form or give success message
                setStudentId('');
                setAmount('');
                setPaymentDate('');
            })
            .catch(error => {
                console.error('There was an error adding the payment!', error);
            });
    };

    return (
        <div>
            <h2>Add Payment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Student ID:</label>
                    <input
                        type="number"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Payment Date:</label>
                    <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Payment</button>
            </form>
        </div>
    );
};

export default AddPayment;
