//This function will log details (method, URL, status code, duration)about each incoming request and 
// the corresponding response.
export const logger = (req, res, next) => {
  const start = Date.now();
//Records the start time of the request to calculate duration later.
  res.on("finish", () => {
//Listens for the "finish" event on the response object, which indicates that the response has been sent to the client.
    const duration = Date.now() - start;  
//Calculates the duration of the request by subtracting the start time from the current time.
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    //Logs the HTTP method, original URL, status code, and duration in milliseconds to the console. 
    // This helps in monitoring and debugging the application by providing insights into the performance 
    // of each request.
  });

  next();
};
