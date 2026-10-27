import { statsService } from "../services/statsService.js";
import { studentService } from "../services/studentService.js";
//The controller imports: statsService → contains calculation logic / studentService → gets students data
export const statsController = {   //Creates an object called statsController.
  average(req, res) {  //Calculates average grade of students, optionally filtered by field.
    const students = studentService.getAll(req.query.field); //Calls studentService.getAll() to get students, Gets data from URL query.(ex :GET /stats/average?field=programming))
    res.json({ //Sends JSON response to client.
      success: true,
      field: req.query.field || null,// means If field exists → use it , If not → null
      count: students.length,//Returns number of students
      average: statsService.groupAverage(students)  //Returns calculated average.
    });
  }
};
