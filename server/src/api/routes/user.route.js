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
  } = require("../controllers/user.controller.js"),
  { registerUser } = require("../validations/user.validation.js");

const router = express.Router();

router.route("/").get(checkAuth, getAllUsers);

// User registration
router
  .route("/register")
  .get((req, res, next) => {
    res.status(httpStatus.OK).json({ message: "Register Page" });
  })
  .post(validate(registerUser), register);

// Get user and update user information and delete user
router.route("/:userId").get(getUser).post(updateInfo).delete(deleteUser);

module.exports = router;
