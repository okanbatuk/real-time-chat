const express = require("express");
const httpStatus = require("http-status");
const { validate } = require("express-validation");
const auth = require("../controllers/auth.controller.js");
const authValids = require("../validations/auth.validation.js");

const router = express.Router();

// User registration
router
  .route("/register")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "Register Page" });
  })
  .post(validate(authValids.registerUser), auth.register);

// User login ops
router
  .route("/login")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "User login page" });
  })
  .post(validate(authValids.loginValidation), auth.login);

module.exports = router;
