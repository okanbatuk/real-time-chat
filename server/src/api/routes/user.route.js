const express = require("express"),
  { validate } = require("express-validation"),
  httpStatus = require("http-status"),
  checkAuth = require("../middlewares/checkauth.js"),
  {
    getAllUsers,
    getUser,
    updateInfo,
    deleteUser,
    register,
    updatePassword,
  } = require("../controllers/user.controller.js"),
  {
    registerUser,
    updateUserPassword,
    deleteValidation,
  } = require("../validations/user.validation.js");

const router = express.Router();

router.route("/").get(getAllUsers);

// User registration
router
  .route("/register")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "Register Page" });
  })
  .post(validate(registerUser), register);

router
  .route("/update-password")
  .post(checkAuth, validate(updateUserPassword), updatePassword);

// Get user and update user information and delete user
router
  .route("/:userId")
  .get(getUser)
  .post(checkAuth, updateInfo)
  .delete(checkAuth, validate(deleteValidation), deleteUser);

module.exports = router;
