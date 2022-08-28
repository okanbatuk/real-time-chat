const express = require("express"),
  httpStatus = require("http-status"),
  { validate } = require("express-validation"),
  { login } = require("../controllers/auth.controller.js"),
  { loginValidation } = require("../validations/auth.validation.js");

const router = express.Router();

// User login ops
router
  .route("/login")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "User login page" });
  })
  .post(validate(loginValidation), login);

module.exports = router;
