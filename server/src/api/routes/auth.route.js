const express = require("express"),
  httpStatus = require("http-status"),
  { login } = require("../controllers/auth.controller.js");

const router = express.Router();

// User login ops
router
  .route("/login")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "User login page" });
  })
  .post(login);

module.exports = router;
