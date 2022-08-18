const httpStatus = require("http-status"),
  ExtendableError = require("./extendableError.js");

/*
 * Error represents
 * @extends {ExtendableError}
 *
 */

class APIError extends ExtendableError {
  constructor({ message, errors, status, stack }) {
    super(message, errors, status, stack);
  }
}

exports.module = APIError;
