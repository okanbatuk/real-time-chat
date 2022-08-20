const httpStatus = require("http-status"),
  mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  User = require("../models/user.model.js");

// Get user Function
exports.getUser = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      return next(error);
    }
    let id = `${req.params.userId}`;
    let result = await User.findById(id)
      .exec()
      .then((doc) => {
        return doc;
      });
    return result;
  } catch (error) {
    return next(error);
  }
};

// Register Function
exports.register = async (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.fullName) {
    return next(error);
  } else {
    try {
      let cryptedPassword = await bcrypt.hash(req.body.password, 10);
      let user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        fullName: req.body.fullName,
        password: cryptedPassword,
      });
      let result = await user.save().then((result) => {
        return result;
      });
      return result;
    } catch (error) {
      return next(error);
    }
  }
};
