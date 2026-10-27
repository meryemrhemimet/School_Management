import { csvService } from "../services/csvService.js";
import { statsService } from "../services/statsService.js";
import { studentService } from "../services/studentService.js";
//The controller imports 3 services: studentService handles student operations: get / create /update 
//statsService handles calculations: averages statistics.
//csvService :Converts student data into CSV format. 
export const studentController = {
  getAll(req, res) { //Gets all students.
    const students = studentService.getAll(req.query.field);//Gets students from service,can filter by field.
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  },

  getById(req, res) { //Gets a student by ID.
    res.json({
      success: true,
      data: studentService.getById(req.params.id)//Gets student from service by ID passed in URL parameters.
    });
  },

  create(req, res) { //Creates a new student.
    try {
      const student = studentService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur lors de la création de l'étudiant."
      });
    }
  },

  update(req, res) {//Updates an existing student.
    res.json({
      success: true,
      message: "Student updated successfully",
      data: studentService.update(req.params.id, req.body)//Updates the student with the specified ID using the data from the request body.
    });
  },

  softDelete(req, res) {//Soft deletes a student.
    res.json({
      success: true,
      message: "Student soft deleted successfully",
      data: studentService.softDelete(req.params.id)//Soft deletes the student with the specified ID.
    });
  },

  exportCsv(req, res) {
    const students = studentService.getAll(req.query.field);
    //Gets students list.Can filter by field.
    const csv = csvService.studentsToCsv(students, statsService);
    //Uses csvService to transform students into CSV text.

    res.setHeader("Content-Type", "text/csv");
    //Sets the response header to indicate that the content is CSV.
    res.setHeader("Content-Disposition", "attachment; filename=students.csv");
    //Tells browser to download with filename:students.csv
    res.send(csv);//Sends CSV content to client.Browser downloads the file.
  }
};
