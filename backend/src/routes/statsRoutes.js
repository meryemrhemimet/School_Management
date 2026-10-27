import { Router } from "express";
// Imports the Router class from the Express framework, which is used to create modular route handlers.
import { statsController } from "../controllers/statsController.js";
// Imports the statsController, which contains the logic for handling statistics-related requests.

const router = Router();
// Creates a new router instance that will be used to define the statistics-related routes.

router.get("/average", statsController.average);
// Defines a GET route at the path "/average" that calls the average method of the statsController to retrieve 
// average statistics.

export default router;
// Exports the router as the default export of this module, allowing it to be imported 
// and used in other parts of the application.          

