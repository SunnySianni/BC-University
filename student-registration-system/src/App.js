import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudentList from "./components/StudentList";
import AddStudent from "./components/AddStudent";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<StudentList />} />
                <Route path="/add-student" element={<AddStudent />} />
            </Routes>
        </Router>
    );
}

export default App;
