const bcrypt = require("bcrypt"),
  httpStatus = require("http-status"),
  User = require("../models/user.model.js"),
  {
    generateAccessToken,
    generateRefreshToken,
  } = require("../../config/passport.js");

// users login operation is here
exports.login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    let error = {
      message: "Please enter all required fields.",
      status: httpStatus.BAD_REQUEST,
    };
    return next(error);
  }
  let password = `${req.body.password}`;
  User.findOne({ email: req.body.email })
    .exec()
    .then(async (foundUser) => {
      if (foundUser instanceof User) {
        let match = await bcrypt.compare(password, foundUser.password);
        if (match) {
          if (foundUser.isActive == false) {
            User.updateOne(
              { email: foundUser.email },
              { $set: { isActive: true } }
            ).then(() => {
              foundUser.save();
            });
          }
          let accessToken = await generateAccessToken({
            UserInfo: {
              _id: foundUser._id,
              email: foundUser.email,
              fullName: foundUser.fullName,
            },
          });
          return res.status(httpStatus.OK).json({
            message: "User logged in successfully",
            status: httpStatus.OK,
            token: accessToken,
          });
        }
      }
      let error = {
        message: "Email or password incorrect",
        status: httpStatus.UNAUTHORIZED,
      };
      return next(error);
    })
    .catch((err) => {
      return next(err);
    });
};
