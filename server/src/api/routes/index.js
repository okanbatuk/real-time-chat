const express = require("express"),
  httpStatus = require("http-status"),
  router = express.Router();

const userRoute = require("./user.route.js");

// GET req => api/status
router.route("/status").get((req, res, next) => {
  res.status(httpStatus.OK).json({ message: "Everything is OK!" });
});

// Routes
router.use("/users", userRoute);

// if doesnt exist routes, send error
router.use((error, req, res, next) => {
  return next(error);
});

module.exports = router;
