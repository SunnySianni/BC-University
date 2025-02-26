import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul>
                {/* Link to Home */}
                <li><Link to="/">Home</Link></li>

                {/* Link to Add Student */}
                <li><Link to="/add-student">Add Student</Link></li>

                {/* Link to View Students */}
                <li><Link to="/students">View Students</Link></li>

                {/* Link to Add Course */}
                <li><Link to="/add-course">Add Course</Link></li>

                {/* Link to View Courses */}
                <li><Link to="/courses">View Courses</Link></li>

                {/* Link to Add Payment */}
                <li><Link to="/add-payment">Add Payment</Link></li>

                {/* Link to View Payments */}
                <li><Link to="/payments">View Payments</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
