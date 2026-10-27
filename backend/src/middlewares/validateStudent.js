import { z } from "zod";
//Zod is a library used to validate data
// Validation schemas for student creation and update.
export const createStudentSchema = z.object({
    // Defines a schema for creating a student using the zod library.
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  // Validates that the name is a string, trims whitespace, and requires a minimum length of 2 characters
  age: z.coerce.number().int().min(5).max(100),
  // Validates that the age is a number, coerces it from a string if necessary, ensures it's an integer, and restricts it to a range between 5 and 100.
  field: z.string().trim().min(2, "Field is required"),
  // Validates that the field is a string, trims whitespace, and requires a minimum length of 2 characters.
  grades: z.array(z.coerce.number().min(0).max(20)).default([])
  // Validates that grades is an array of numbers, coerces each grade from a string if necessary, and ensures each grade is between 0 and 20. If no grades are provided, it defaults to an empty array.
});

export const updateStudentSchema = createStudentSchema.partial().refine(
  // Defines a schema for updating a student by making all fields optional using the .partial() method.
  (value) => Object.keys(value).length > 0,
  // Adds a refinement to ensure that at least one field is provided in the update request.
  "At least one field must be provided"
);

export const validateStudent = (schema) => (req, res, next) => {
  // Defines a middleware function called validateStudent that takes a schema as an argument 
  const result = schema.safeParse(req.body);
// Uses the safeParse method of the zod schema to validate the incoming request body against the provided schema.
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten()
    });
  }

  req.body = result.data;
  next();
};
