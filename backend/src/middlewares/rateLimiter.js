//This middleware limits the number of student creation requests from a single IP address to 10 per minute.
// It uses an in-memory Map keyed by IP address. Each entry stores a request count and a resetAt timestamp (1 minute from first request). 
// On each incoming request it increments the count; once it exceeds 10, it returns 429 Too Many Requests. 
// The window auto-resets after 1 minute. Note: because this is in-memory, it resets when the server restarts and 
// doesn't share state across multiple server instances.
const requestsByIp = new Map();
//This (in-memory) map will store the count of requests and the reset time for each IP address.
export const createStudentRateLimiter = (req, res, next) => {
//Creates a middleware function called createStudentRateLimiter. 

  const ip = req.ip;//Gets the IP address of the incoming request using req.ip.
  const now = Date.now();//Gets the current timestamp in milliseconds.
  const oneMinute = 60 * 1000;//Defines the duration of one minute in milliseconds.
  const limit = 10;//Sets the maximum number of allowed requests per IP address within the time window (1 minute).

  const record = requestsByIp.get(ip) || {
  //Retrieves the record for the IP address from the map. If no record exists, 
  // initializes it with a count of 0 and a reset time one minute in the future.
    count: 0,
    resetAt: now + oneMinute
  };

  if (now > record.resetAt) {//Checks if the current time has passed the reset time for the IP address.
    record.count = 0;
    record.resetAt = now + oneMinute;
  }

  record.count += 1;//Increments the count of requests for the IP address.
  requestsByIp.set(ip, record);//Updates the map with the new count and reset time for the IP address.

  if (record.count > limit) {
  //If the count of requests exceeds the defined limit, 
  // returns a JSON response with status code 429 (Too Many Requests) and an error message.
    return res.status(429).json({
      success: false,
      message: "Too many creation requests. Please try again later."
    });
  }

  next();
};
