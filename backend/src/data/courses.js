//This code manages courses data stored in a JSON file. It: reads courses /saves courses/creates new course
import fs from "fs";
//The code uses the fs module to read and write to the courses.json file, 
// and the path and url modules to handle file paths and URLs.
import path from "path";
// The path module is used to construct the file path to the courses.json file, 
// ensuring compatibility across different operating systems.
import { fileURLToPath } from "url";
// The fileURLToPath function from the url module is used to convert the module's URL to a file path, 

const now = () => new Date().toISOString();
// The now function returns the current date and time in ISO string format, 
// which is used for timestamps when creating or updating courses.
const __filename = fileURLToPath(import.meta.url);
// The __filename constant holds the file path of the current module, 
// which is obtained by converting the module's URL to a file path using the fileURLToPath function.
const __dirname = path.dirname(__filename);
// The __dirname constant holds the directory path of the current module
const coursesFilePath = path.join(__dirname, "courses.json");
// The coursesFilePath constant constructs the full file path to the courses.json file by joining 
// the directory path with the filename.
export const courses = JSON.parse(fs.readFileSync(coursesFilePath, "utf-8"));
// The courses constant reads the contents of the courses.json file synchronously,


let nextId = Math.max(...courses.map((course) => course.id)) + 1;
// The nextId variable is initialized to one more than the maximum ID found in the existing courses,
// ensuring that new courses will have unique IDs.
export const saveCourses = () => {
  fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2));
};
// The saveCourses function writes the current state of the courses array back to the courses.json file in 
// a formatted manner (with indentation for readability).
export const createCourse = (data) => {
  const createdAt = now();
// The createCourse function takes a data object as input, creates a new course object with a unique ID,
// the provided data, and timestamps for creation and last update. It returns the newly created course object.
  return {
    id: nextId++,
    ...data,
    isDeleted: false,
    createdAt,
    updatedAt: createdAt
  };
  // The new course object includes an id (generated from nextId), the data properties spread into it
};
