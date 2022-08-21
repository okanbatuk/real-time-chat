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
  .post((req, res, next) => {
    if (!req.body.email || !req.body.password) {
      let error = {
        message: "Please enter all required fields.",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    }
    try {
      login(req).then((result) => {
        if (result) {
          return res.status(httpStatus.OK).json({
            message: "User logged in successfully",
            status: httpStatus.OK,
            token: result,
          });
        }
        let error = {
          status: httpStatus.NOT_FOUND,
          message: "User not found",
        };
        return next(error);
      });
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
