import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { dirname } from "path";
import errorHandler from "./middleware/errorHandler.js";
import studentRoute from './routes/students.js'; 
import coursesRoute from './routes/courses.js';
import cors from "cors";
import 'dotenv/config'; 

// ES6 module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Default route for dashboard
app.get("/", (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

app.get("/students", studentRoute); 
app.get("/courses", coursesRoute)

// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};

startServer();
