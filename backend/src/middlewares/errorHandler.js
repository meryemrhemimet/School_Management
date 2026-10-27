export const errorHandler = (error, req, res, next) => { //Creates a middleware function called errorHandler. 
//The global safety net. When any controller or service throws an error (instead of catching it themselves), 
// Express catches it and passes it here
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    //Checks if the error is a SyntaxError caused by invalid JSON in the request body.
    return res.status(400).json({
    //Returns a JSON response with status code 400 (Bad Request) and an error message.
      success: false,
      message: "Invalid JSON payload"
    });
  }

  res.status(error.status || 500).json({
  //For other types of errors, returns a JSON response with the error's status code (or 500 if not specified) and an error message.
    success: false,
    message: error.message || "Internal server error"
  });
};






//Prevents server crash
//Sends clean error messages
//Centralizes error managemen