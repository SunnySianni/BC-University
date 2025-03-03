import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { dirname } from "path";
import routes from './route/routes.js'; // Import the combined routes
import cors from "cors";
import 'dotenv/config'; 
import { connectDB, syncDatabase } from './config/database.js'; // Import the database connection

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


// Default route for index (formerly dashboard)
app.get("/", (req, res) => {
  res.render("index", { title: "Home" }); // Render the 'index.ejs' view
});

// Use the combined routes file
app.use("/", routes);  // Now we use the single routes file for all routes

// Fallback route for undefined routes (404)
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" }); // You can create a custom 404 page
});

// Start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    await syncDatabase();  // Sync models with the database

    const PORT = process.env.PORT || 5000; // Default to 5000 if not defined in .env
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Exit the process if there's a failure
  }
};

startServer();
