class ApplicationError extends Error {
  constructor(message, statusCode) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.message = message || "Something went wrong";
    this.statusCode = statusCode || 500;
  }
}

module.exports = ApplicationError;
