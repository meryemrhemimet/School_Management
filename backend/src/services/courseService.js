import { courses, createCourse, saveCourses } from "../data/courses.js";
// Import courses (An array that stores all courses.) createCourse (A function that creates a new course object.) 
// saveCourses (A function that saves changes)
const activeCourses = () => courses.filter((course) => !course.isDeleted);
// A helper function that returns only the active (not deleted) courses.
const findCourseIndex = (id) =>
  courses.findIndex((course) => course.id === Number(id) && !course.isDeleted);
// A helper function that finds the index of a course by its ID, ensuring it is not deleted.
export const courseService = {
  // The courseService object contains methods for managing courses, including getting all courses, 
  // getting a course by ID, creating a new course, updating an existing course, and soft-deleting a course.
  getAll(field) {
    //Gets all courses.
    if (!field) {
    //If no field is given, it returns all active courses.
      return activeCourses();
    }
    //If field exists it filters the active courses by the specified field.
    return activeCourses().filter(
      (course) => course.field.toLowerCase() === field.toLowerCase()
    );
  },

  getById(id) {
//Gets one course by its ID.
    const course = activeCourses().find((item) => item.id === Number(id));
//Searches for the course with the specified ID among the active courses. 
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
//If the course is not found, it throws a 404 error (Resource not found)
    return course;
  },
//If the course is found, it returns the course.
  create(data) {
//Creates a new course.
    const course = createCourse(data);
    //Creates a course object.
    courses.push(course);
    //Adds it to the array.
    saveCourses();
    return course;
  },

  update(id, data) {
  //Updates an existing course by its ID.
    const index = findCourseIndex(id);
    //Finds the index of the course to be updated.
    if (index === -1) {
    //If the course is not found, it throws a 404 error (Resource not found).
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    //If the course is found, it updates the course object with the new data and sets the updatedAt timestamp to the current date and time.
    courses[index] = {
      ...courses[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
     
    return courses[index];
    //Returns the updated course object.
  },

  softDelete(id) {
  //Soft-deletes a course by its ID.
    const course = this.getById(id);
    //First, it retrieves the course using the getById method. 
    course.updatedAt = new Date().toISOString();
    //Then, it sets the updatedAt timestamp to the current date and time.
    course.isDeleted = true;
    //Next, it marks the course as deleted by setting the isDeleted property to true.
    saveCourses();
    return course;
  }
};
