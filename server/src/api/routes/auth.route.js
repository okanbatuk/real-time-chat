const express = require("express"),
  httpStatus = require("http-status"),
  { validate } = require("express-validation"),
  { login, register } = require("../controllers/auth.controller.js"),
  {
    registerUser,
    loginValidation,
  } = require("../validations/auth.validation.js");

const router = express.Router();

// User registration
router
  .route("/register")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "Register Page" });
  })
  .post(validate(registerUser), register);

// User login ops
router
  .route("/login")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "User login page" });
  })
  .post(validate(loginValidation), login);

module.exports = router;
