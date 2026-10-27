import { z } from "zod";
//Zod is a library used to validate data
// Validation schemas for course creation and update .
export const createCourseSchema = z.object({
  // Defines a schema for creating a course using the zod library.
  title: z.string().trim().min(2, "Title must contain at least 2 characters"),
  // Validates that the title is a string, trims whitespace, and requires a minimum length of 2 characters.
  instructor: z.string().trim().min(2, "Instructor is required"),
  // Validates that the instructor is a string, trims whitespace, and requires a minimum length of 2 characters.
  field: z.string().trim().min(2, "Field is required"),
  // Validates that the field is a string, trims whitespace, and requires a minimum length of 2 characters.
  duration: z.string().trim().min(2, "Duration is required")
  // Validates that the duration is a string, trims whitespace, and requires a minimum length of 2 characters.
});

export const updateCourseSchema = createCourseSchema.partial().refine(
  // Defines a schema for updating a course by making all fields optional using the .partial() method.
  //updateStudentSchema uses .partial() — all fields become optional. You can send just { "age": 22 } and it's valid. 
  // But sending an empty {} is rejected by .refine() — at least one field must be present.
  (value) => Object.keys(value).length > 0,
  // Adds a refinement to ensure that at least one field is provided in the update request.
  "At least one field must be provided"
  // Provides a custom error message if the refinement fails, indicating that at least one field must be provided for the update.
);

export const validateCourse = (schema) => (req, res, next) => {
  // Defines a middleware function called validateCourse that takes a schema as an argument 
  const result = schema.safeParse(req.body);
  // Uses the safeParse method of the zod schema to validate the incoming request body against the provided schema.

  if (!result.success) {
    // If the validation fails (result.success is false), it returns a JSON response with status code 400 (Bad Request) and includes the validation errors in the response body.
    return res.status(400).json({
      // The response includes a success flag set to false, a message indicating that validation failed, and the errors from the validation process, which are flattened for easier readability.
      success: false,
      message: "Validation failed",
      errors: result.error.flatten()
      // The flatten() method is used to convert the nested error structure from zod into a more straightforward format that can be easily consumed by the client.
    });
  }

  req.body = result.data;
  next();
};
