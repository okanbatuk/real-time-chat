const express = require("express"),
  httpStatus = require("http-status"),
  { getUser, register } = require("../controllers/user.controller.js");

const router = express.Router();

// Get user
router.route("/:userId").get((req, res, next) => {
  try {
    getUser(req)
      .then((result) => {
        console.log(result);
        return res.status(httpStatus.OK).json(result);
      })
      .catch((error) => {
        error.message = "User Not Found";
        error.status = httpStatus.NOT_FOUND;
        return next(error);
      });
  } catch (error) {
    return next(error);
  }
});

// User registration
router
  .route("/register")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "Register Page" });
  })
  .post((req, res, next) => {
    try {
      register(req)
        .then((result) => {
          return res
            .status(httpStatus.CREATED)
            .json({ message: "Handling POST", createdUser: result });
        })
        .catch((error) => {
          error.message = "Do not created user";
          error.status = httpStatus.BAD_REQUEST;
          return next(error);
        });
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
