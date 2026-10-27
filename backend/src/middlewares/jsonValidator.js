//Ce middleware sert à vérifier que les requêtes qui envoient des données (POST, PUT, PATCH) 
//utilisent bien le format JSON.
export const jsonMiddleware = (req, res, next) => {
//Creates a middleware function called jsonMiddleware. 
// This function will be used to validate that incoming requests with a body have the correct Content-Type header set to application/json.
  const methodsWithBody = ["POST", "PUT", "PATCH"];
//Defines an array of HTTP methods that typically include a request body.
  if (methodsWithBody.includes(req.method) && !req.is("application/json")) {
//Checks if the incoming request method is one that should have a body and if the Content-Type header is not set to application/json.
    return res.status(400).json({
//If the Content-Type is incorrect, returns a JSON response with status code 400 (Bad Request) and an error message.
      success: false,
      message: "Content-Type must be application/json"
    });
  }
  next();
};
