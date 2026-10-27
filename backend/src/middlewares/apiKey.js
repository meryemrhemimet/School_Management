export const apiKeyMiddleware = (req, res, next) => {
//Creates a middleware function called apiKeyMiddleware.Middleware runs before accessing routes.
  const apiKey = req.header("x-api-key");
  //Reads the header:x-api-key from the incoming request.
  // This header should contain the API key provided by the client.
  const validApiKey = process.env.API_KEY || "school-secret-key";
  //Gets the real API key from .env
  if (apiKey !== validApiKey) {//Checks if key is valid
    return res.status(401).json({  //401 Means: Unauthorized
      success: false,
      message: "A valid x-api-key header is required"
    });
  }
//If the API key is valid, calls next() to proceed to the next middleware or route handler.
  next();
};






//protect APIs
//block unauthorized users
//secure backend access 