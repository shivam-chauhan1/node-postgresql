export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error status and message
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Custom error handling based on error name
  switch (err.name) {
    case "ValidationError":
      status = 400;
      message = err.message;
      break;
    case "UnauthorizedError":
      status = 401;
      message = "Authentication failed";
      break;
    case "ForbiddenError":
      status = 403;
      message = "Insufficient permissions";
      break;
    case "NotFoundError":
      status = 404;
      message = err.message || "Resource not found";
      break;
  }

  // Send response
  res.status(status).json({
    error: {
      status,
      message,
    },
  });
};
