class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode() {
    return this.status;
  }
  errorMessage() {
    return this.message;
  }
}

module.exports = CustomError;
