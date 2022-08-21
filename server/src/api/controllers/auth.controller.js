const bcrypt = require("bcrypt"),
  User = require("../models/user.model.js"),
  {
    generateAccessToken,
    generateRefreshToken,
  } = require("../../config/passport.js");

// users login operation is here
exports.login = async (req, res, next) => {
  let password = `${req.body.password}`;
  let response = await User.findOne({ email: req.body.email })
    .where("isActive", true)
    .exec()
    .then(async (foundUser) => {
      if (foundUser instanceof User) {
        let match = await bcrypt.compare(password, foundUser.password);
        if (match) {
          let accessToken = await generateAccessToken({
            UserInfo: {
              _id: foundUser._id,
              email: foundUser.email,
              fullName: foundUser.fullName,
            },
          });

          return accessToken;
        }
        return null;
      }
      return null;
    })
    .catch((err) => {
      return err;
    });
  return response;
};
