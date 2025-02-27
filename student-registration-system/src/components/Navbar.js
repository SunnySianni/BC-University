import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/add-student" className="nav-link">Add Student</Link></li>
                <li><Link to="/students" className="nav-link">View Students</Link></li>
                <li><Link to="/add-course" className="nav-link">Add Course</Link></li>
                <li><Link to="/courses" className="nav-link">View Courses</Link></li>
                <li><Link to="/add-payment" className="nav-link">Add Payment</Link></li>
                <li><Link to="/payments" className="nav-link">View Payments</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
