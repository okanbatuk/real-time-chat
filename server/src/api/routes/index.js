const express = require("express"),
  httpStatus = require("http-status"),
  router = express.Router();

// GET req => api/status
router.route("/status").get((req, res, next) => {
  res.status(httpStatus.OK).json({ message: "Everything is OK!" });
});

router.use((error, req, res, next) => {
  return next(error);
});

module.exports = router;
