const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const db = require("./config/db");

const app = express();

// CORS configuration to allow only frontend requests from localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());  // Middleware to parse JSON data






app.listen(5000, () => {
    console.log("Server running on port http://localhost:5000/courses");
});
