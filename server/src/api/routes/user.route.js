const express = require("express"),
  httpStatus = require("http-status"),
  checkAuth = require("../middlewares/checkauth.js"),
  {
    getAllUsers,
    getUser,
    updateInfo,
    deleteUser,
    register,
  } = require("../controllers/user.controller.js");

const router = express.Router();

router.route("/").get(checkAuth, (req, res, next) => {
  try {
    getAllUsers(req)
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

// User registration
router
  .route("/register")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "Register Page" });
  })
  .post((req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.fullName) {
      let error = {
        message: "Please enter all required fields.",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    } else {
      register(req)
        .then((result) => {
          if (result) {
            return res.status(httpStatus.CREATED).json({
              message: "Created user successfully",
              createdUser: result,
            });
          }
          let error = {
            message: "Email has already been used",
            status: httpStatus.NOT_ACCEPTABLE,
          };
          return next(error);
        })
        .catch((error) => {
          return next(error);
        });
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
          let error = {
            status: httpStatus.NOT_FOUND,
            message: "User not found",
          };
          return next(error);
        })
        .catch((error) => {
          return next(error);
        });
    } catch (error) {
      return next(error);
    }
  })
  .post((req, res, next) => {
    try {
      if (!req.body.email || !req.body.fullName) {
        let error = {
          message: "Please enter all required fields.",
          status: httpStatus.BAD_REQUEST,
        };
        return next(error);
      }
      updateInfo(req)
        .then((result) => {
          if (result.modifiedCount > 0) {
            return res
              .status(httpStatus.OK)
              .json({ message: "Update is successful", status: httpStatus.OK });
          }
          let error = {
            message: "Nothing has been changed",
            status: httpStatus.BAD_REQUEST,
          };
          return next(error);
        })
        .catch((error) => {
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
          let error = {
            message: "User deletion failed",
            status: httpStatus.BAD_REQUEST,
          };
          return next(error);
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
