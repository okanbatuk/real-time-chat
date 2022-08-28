const bcrypt = require("bcrypt"),
  httpStatus = require("http-status"),
  User = require("../models/user.model.js"),
  {
    generateAccessToken,
    generateRefreshToken,
  } = require("../../config/passport.js");

// users login operation is here
exports.login = async (req, res, next) => {
  try {
    let email = `${req.body.email}`,
      password = `${req.body.password}`;
    let foundUser = await User.findOne({ email: { $eq: email } });
    let isMatch = await bcrypt.compare(password, foundUser.password);
    if (isMatch) {
      foundUser.isActive = true;
      foundUser.save();
      let accessToken = await generateAccessToken({
        userInfo: {
          _id: foundUser._id,
          email: foundUser.email,
          fullName: foundUser.fullName,
        },
      });
      return accessToken
        ? res.status(httpStatus.OK).json({
            message: "User logged in successfully",
            status: httpStatus.OK,
            token: accessToken,
          })
        : next({
            message: "Authentication failed",
            status: httpStatus.INTERNAL_SERVER_ERROR,
          });
    } else {
      let error = {
        message: "Email or password incorrect",
        status: httpStatus.UNAUTHORIZED,
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};
