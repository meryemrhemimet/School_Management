import { createStudent, saveStudents, students } from "../data/students.js";
// Importing necessary functions and data from the students.js file.
const activeStudents = () => students.filter((student) => !student.isDeleted);
// A helper function that returns only the active (not deleted) students.
const findStudentIndex = (id) =>
  // A helper function that finds the index of a student by its ID, ensuring it is not deleted.
  students.findIndex((student) => student.id === Number(id) && !student.isDeleted);
  // It searches for the student with the specified ID among the active students and returns the index of the student in the array.
export const studentService = {
  // The studentService object contains methods for managing students, including getting all students 
  getAll(field) {
    if (!field) {
      return activeStudents();
    }
  // If no field is given, it returns all active students.
    return activeStudents().filter(
      (student) => student.field.toLowerCase() === field.toLowerCase()
    );
    // If field exists it filters the active students by the specified field.
  },

  getById(id) {
    const student = activeStudents().find((item) => item.id === Number(id));
  // It searches for the student with the specified ID among the active students.
    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }
  // If the student is not found, it throws a 404 error (Resource not found)
    return student;
  // If the student is found, it returns the student.
  },

  create(data) {
    // Vérifie si un étudiant avec le même email existe déjà (non supprimé)
    const exists = activeStudents().some((student) => student.email === data.email);
    if (exists) {
      const error = new Error("Un étudiant avec cet email existe déjà.");
      error.status = 409;
      throw error;
    }
    const student = createStudent(data);
    students.push(student);
    saveStudents();
    return student;
  },
  // Creates a new student. It creates a student object using the createStudent function, 
  // adds it to the students array, saves the updated students array to the file, 
  // and returns the newly created student.
  update(id, data) {
    const index = findStudentIndex(id);

    if (index === -1) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }
  // If the student is not found, it throws a 404 error (Resource not found).
    students[index] = {
      ...students[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
  // If the student is found, it updates the student object with the new data and sets the updatedAt timestamp to the current date and time.
    saveStudents();
    return students[index];
    // It saves the updated students array to the file and returns the updated student.
  },

  softDelete(id) {
    const student = this.getById(id);
    student.isDeleted = true;
    student.updatedAt = new Date().toISOString();
    saveStudents();
    return student;
  }
};
// Soft-deletes a student by its ID. It retrieves the student using the getById method, 