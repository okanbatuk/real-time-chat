const express = require("express"),
  { validate } = require("express-validation"),
  checkAuth = require("../middlewares/checkauth.js"),
  {
    getAllUsers,
    getUser,
    updateInfo,
    deleteUser,
    updatePassword,
  } = require("../controllers/user.controller.js"),
  {
    updateUserPassword,
    deleteValidation,
  } = require("../validations/user.validation.js");

const router = express.Router();

router.route("/").get(getAllUsers);

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
