const ExtendableError = require("./extendableError.js");

/*
 * Error represents
 * @extends {ExtendableError}
 *
 */

class APIError extends ExtendableError {
  constructor({ message, errors, status, stack }) {
    super({ message, errors, status, stack });
  }
}

module.exports = APIError;
