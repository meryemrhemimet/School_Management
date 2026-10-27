import { courseService } from "../services/courseService.js";
// It imports the courseService.
//The controller will use this service to : get courses/create courses /update courses/ delete courses .
export const courseController = {
  //This creates an object called courseController.
  getAll(req, res) {
    const courses = courseService.getAll(req.query.field);//query params 
//Calls the service function getAll().req.query.field : Gets data from URL query.(ex :GET /courses?field=programming)
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  },
//Sends JSON response to client.
  getById(req, res) {
    res.json({
      success: true,
      data: courseService.getById(req.params.id)//route params 
    });
  },
//Gets one course by ID.(req.params.id : Gets data from URL parameter.(ex :GET /courses/123))
  create(req, res) {   //Creates a new course.
    res.status(201).json({  //201 Means Resource created successfully.(Set HTTP status code)
      message: "Course created successfully",
      data: courseService.create(req.body)//body params 
      //req.body : Contains data sent by client.
    });
  },

  update(req, res) {  //Updates an existing course.
    res.json({
      success: true,
      message: "Course updated successfully",
      data: courseService.update(req.params.id, req.body)//req.params.id → which course /req.body → new data
    });
  },
//URL parameters 
  softDelete(req, res) {
    res.json({
      success: true,
      message: "Course soft deleted successfully",
      data: courseService.softDelete(req.params.id)
    });
  }
};
