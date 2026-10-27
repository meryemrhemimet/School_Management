import { Router } from "express";
// Imports the Router class from the Express framework, which is used to create modular route handlers.
import { studentController } from "../controllers/studentController.js";
import { apiKeyMiddleware } from "../middlewares/apiKey.js";
import { createStudentRateLimiter } from "../middlewares/rateLimiter.js";
import {
  createStudentSchema,
  updateStudentSchema,
  validateStudent
} from "../middlewares/validateStudent.js";
 
const router = Router();
// Creates a new router instance that will be used to define the student-related routes.
router.get("/export", studentController.exportCsv);
// Defines a GET route at the path "/export" that calls the exportCsv method of the studentController to
//  export student data in CSV format.
router.get("/", studentController.getAll);
// Defines a GET route at the root path ("/") that calls the getAll method of the studentController to retrieve 
// all students.
router.get("/:id", studentController.getById);
// Defines a GET route at the path "/:id" that calls the getById method of the studentController to retrieve
//  a specific student by its ID.
router.post("/",createStudentRateLimiter, apiKeyMiddleware, validateStudent(createStudentSchema),
  studentController.create
);
// Defines a POST route at the root path ("/") that first applies the createStudentRateLimiter to limit the rate of
//  student creation requests, then checks for a valid API key, then validates the incoming data against the 
// createStudentSchema, and finally calls the create method of the studentController to create a new student.
router.put(
  "/:id",
  apiKeyMiddleware,
  validateStudent(updateStudentSchema),
  studentController.update
);
// Defines a PUT route at the path "/:id" that first checks for a valid API key, then validates the incoming data
//  against the updateStudentSchema, and finally calls the update method of the studentController to update an existing 
// student.
router.delete("/:id", apiKeyMiddleware, studentController.softDelete);
// Defines a DELETE route at the path "/:id" that first checks for a valid API key, and then calls the softDelete
//  method of the studentController to mark a specific student as deleted.
export default router;
