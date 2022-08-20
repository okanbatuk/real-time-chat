const express = require("express"),
  httpStatus = require("http-status"),
  {
    getAllUsers,
    getUser,
    updateInfo,
    deleteUser,
    register,
    login,
  } = require("../controllers/user.controller.js");

const router = express.Router();

router.route("/").get((req, res, next) => {
  try {
    getAllUsers()
      .then((results) => {
        return res.status(httpStatus.OK).json(results);
      })
      .catch((err) => {
        return next(err);
      });
  } catch (error) {
    return next(error);
  }
});

// User login ops
router
  .route("/login")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "User login page" });
  })
  .post((req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Please enter all required fields",
        status: httpStatus.BAD_REQUEST,
      });
    }
    try {
      login(req).then((result) => {
        if (result) {
          return res.status(httpStatus.OK).json({
            message: "User logged in successfully",
            status: httpStatus.OK,
            user: result,
          });
        }
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "User Not Found", status: httpStatus.NOT_FOUND });
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
    if (!req.body.email || !req.body.password || !req.body.fullName) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter all fields.",
      });
    } else {
      try {
        register(req)
          .then((result) => {
            return res.status(httpStatus.CREATED).json({
              message: "Created user successfully",
              createdUser: result,
            });
          })
          .catch((error) => {
            error.message = "Do not created user";
            error.status = httpStatus.BAD_REQUEST;
            return next(error);
          });
      } catch (error) {
        return next(error);
      }
    }
  });

// Get user and update user information and delete user
router
  .route("/:userId")
  .get((req, res, next) => {
    try {
      getUser(req)
        .then((result) => {
          if (result) {
            return res.status(httpStatus.OK).json(result);
          }
          return res
            .status(httpStatus.NOT_FOUND)
            .json({ message: "User not found", status: httpStatus.NOT_FOUND });
        })
        .catch((error) => {
          error.message = "User Not Found";
          error.status = httpStatus.NOT_FOUND;
          return next(error);
        });
    } catch (error) {
      return next(error);
    }
  })
  .post((req, res, next) => {
    try {
      if (!req.body.email || !req.body.fullName) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: "Please enter all fields.",
          status: httpStatus.BAD_REQUEST,
        });
      }
      updateInfo(req)
        .then((result) => {
          if (result.modifiedCount > 0) {
            return res
              .status(httpStatus.OK)
              .json({ message: "Update is successful", status: httpStatus.OK });
          }
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "Nothing has been changed",
            status: httpStatus.BAD_REQUEST,
          });
        })
        .catch((error) => {
          error.message = "User Not Updated";
          error.status = httpStatus.BAD_REQUEST;
          return next(error);
        });
    } catch (error) {
      return next(error);
    }
  })
  .delete((req, res, next) => {
    try {
      deleteUser(req)
        .then((result) => {
          if (result.modifiedCount > 0) {
            return res.status(httpStatus.OK).json({
              message: "User deletion successful",
              status: httpStatus.OK,
            });
          }
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "User deletion failed",
            status: httpStatus.BAD_REQUEST,
          });
        })
        .catch((error) => {
          error = {
            message: "User Not Deleted",
            status: httpStatus.BAD_REQUEST,
          };
          return next(error);
        });
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
