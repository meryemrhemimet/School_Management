// server.js - Main entry point for the School Management API
import cors from "cors";
// Importing the CORS middleware to enable Cross-Origin Resource Sharing, 
// allowing the API to be accessed from different origins (e.g., frontend applications).
import dotenv from "dotenv";
// Importing the dotenv package to load environment variables from a .env file,
import express from "express";
// Importing the Express framework to create the API server and handle routing.

import { errorHandler } from "./middlewares/errorHandler.js";
import { jsonMiddleware } from "./middlewares/jsonValidator.js";
import { logger } from "./middlewares/logger.js";
import courseRoutes from "./routes/courseRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
// Importing custom middleware functions for error handling, JSON validation, and logging,
dotenv.config();
// Loading environment variables from the .env file into process.env.
const app = express();
// Creating an instance of the Express application to set up the API server.
const PORT = process.env.PORT || 5000;
// Defining the port on which the API server will listen. It uses the PORT environment variable if defined, or defaults to 5000.

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
// Enabling CORS for the specified origin (the frontend application URL) to allow cross-origin requests to the API.
app.use(logger);
// Using the custom logger middleware to log incoming requests and their details.
app.use(jsonMiddleware);
// Using the custom JSON validation middleware to ensure that incoming requests with JSON bodies are properly formatted.
app.use(express.json());
// Using the built-in Express middleware to parse incoming JSON request bodies.

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "School Management API"
  });
});
// Defining a simple health check endpoint at /api/health that responds with a JSON object indicating 
// the status of the API service.
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/stats", statsRoutes);
// Mounting the studentRoutes, courseRoutes, and statsRoutes on their respective paths to handle 
// requests related to students, courses, and statistics.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});
// Adding a catch-all route handler for any requests that do not match the defined routes. 
// It responds with a 404 status code and a JSON message indicating that the route was not found.
app.use(errorHandler);
// Using the custom error handling middleware to catch and handle any errors that occur during request processing,
// ensuring that the API responds with appropriate error messages and status codes.
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  // Starting the API server and listening on the defined port. 
  // It logs a message to the console indicating that the API is running and provides the URL for access.
});
