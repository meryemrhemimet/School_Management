// This file defines the routes for handling course-related operations in the application. 
// It uses Express.js to create a router and defines various endpoints for CRUD operations on courses. 
// The routes are protected by an API key middleware and use validation middleware to ensure that incoming data 
// adheres to the defined schemas.
import { Router } from "express";
// Imports the Router class from the Express framework, which is used to create modular route handlers.
import { courseController } from "../controllers/courseController.js";
// Imports the courseController, which contains the logic for handling course-related requests 
import { apiKeyMiddleware } from "../middlewares/apiKey.js";
// Imports the apiKeyMiddleware, which is used to protect the routes by requiring a valid API key in the request headers.
import {
  createCourseSchema,
  updateCourseSchema,
  validateCourse
} from "../middlewares/validateCourse.js";
// Imports the validation schemas and middleware for validating course data in incoming requests.

const router = Router();
// Creates a new router instance that will be used to define the course-related routes.
router.get("/", courseController.getAll);
// Defines a GET route at the root path ("/") that calls the getAll method of the courseController to retrieve all courses.
router.get("/:id", courseController.getById);
// Defines a GET route at the path "/:id" that calls the getById method of the courseController to retrieve 
// a specific course by its ID.
router.post("/", apiKeyMiddleware, validateCourse(createCourseSchema), courseController.create);
// Defines a POST route at the root path ("/") that first checks for a valid API key, then validates the 
// incoming data against the createCourseSchema, and finally calls the create method of the courseController 
// to create a new course.
router.put("/:id", apiKeyMiddleware, validateCourse(updateCourseSchema), courseController.update);
// Defines a PUT route at the path "/:id" that first checks for a valid API key, then validates the incoming data 
// against the updateCourseSchema, and finally calls the update method of the courseController to update an existing 
// course.
router.delete("/:id", apiKeyMiddleware, courseController.softDelete);
// Defines a DELETE route at the path "/:id" that first checks for a valid API key, and then calls the softDelete
//  method of the courseController to mark a specific course as deleted.

export default router;
