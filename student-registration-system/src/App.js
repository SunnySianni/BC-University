import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddStudent from './components/AddStudent';
import Students from './components/StudentList';
import AddCourse from './components/AddCourse';  // Fixed component name
import Courses from './components/Courses';
import AddPayment from './components/AddPayment';
import Payments from './components/Payments';
import Home from './components/Home';  // Home component for the landing page

const App = () => {
    return (
        <Router>
            <Navbar />  {/* Navbar for navigation */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/students" element={<Students />} />
                <Route path="/add-course" element={<AddCourse />} />  
                <Route path="/courses" element={<Courses />} />
                <Route path="/add-payment" element={<AddPayment />} />
                <Route path="/payments" element={<Payments />} />
            </Routes>
        </Router>
    );
};

export default App;
