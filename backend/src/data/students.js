// This code manages students data stored in a JSON file. It: reads students /saves students/creates new student
import fs from "fs";//
import path from "path";
import { fileURLToPath } from "url";

const now = () => new Date().toISOString(); 
// The now function returns the current date and time in ISO string format,
const __filename = fileURLToPath(import.meta.url);
// The __filename constant holds the file path of the current module, 
// which is obtained by converting the module's URL to a file path using the fileURLToPath function.
const __dirname = path.dirname(__filename);
// The __dirname constant holds the directory path of the current module
const studentsFilePath = path.join(__dirname, "students.json");
// The studentsFilePath constant constructs the full file path to the students.json file by joining 
// the directory path with the filename.
export const students = JSON.parse(fs.readFileSync(studentsFilePath, "utf-8"));
// The students constant reads the contents of the students.json file synchronously,
let nextId = Math.max(...students.map((student) => student.id)) + 1;
// The nextId variable is initialized to one more than the maximum ID found in the existing students,
// ensuring that new students will have unique IDs.
export const saveStudents = () => {
  fs.writeFileSync(studentsFilePath, JSON.stringify(students, null, 2));
  // The saveStudents function writes the current state of the students array back to the students.json file 
};
export const createStudent = (data) => {
  const createdAt = now();
// The createStudent function takes a data object as input, creates a new student object with a unique ID,
  return {
    id: nextId++,
    ...data,
    isDeleted: false,
    createdAt,
    updatedAt: createdAt
  };
  // The new student object includes an id (generated from nextId), the data properties spread into it
};
