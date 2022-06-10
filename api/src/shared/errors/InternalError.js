export class InternalError extends Error {
  constructor(message, code = 500, description) {
    super(message);
    this.code = code;
    this.message = message;
    this.description = description;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
