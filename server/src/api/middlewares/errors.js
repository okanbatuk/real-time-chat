const httpStatus = require("http-status"),
  expressValidation = require("express-validation"),
  APIError = require("../errors/APIError");

exports.handler = (error, req, res, next) => {
  const response = {
    status: error.status || httpStatus[error.status],
    message: error.message,
    errors: error.errors,
    stack: error.stack,
  };
  let status = response.status || httpStatus.INTERNAL_SERVER_ERROR;
  res.status(status).json(response);
};

/*
 * error is difference from APIError
 *
 */
exports.converter = (error, req, res, next) => {
  let convertedError = error;

  if (error instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: "ValidationError",
      errors: error.errors,
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      stack: error.stack,
    });
  } else if (!(error instanceof Error)) {
    convertedError = new APIError({
      message: error.message,
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      stack: error.stack,
    });
  }
  return handler(convertedError, req, res, next);
};

exports.notFound = (req, res, next) => {
  const error = new APIError({
    message: "Not Found",
    status: httpStatus.NOT_FOUND,
  });
  return handler(error, req, res, next);
};
