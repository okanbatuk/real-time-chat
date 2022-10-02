const bcrypt = require("bcrypt"),
  httpStatus = require("http-status"),
  { ObjectId } = require("mongoose").Types,
  User = require("../models/user.model.js"),
  {
    generateAccessToken,
    // TODO: generateRefreshToken,
  } = require("../../config/passport.js");

// #region Registration section for users
/*
 * @body
 *   {
 *     email: string
 *     fullName: string
 *     password: string
 *   }
 *
 * @public POST /api/register
 * */
exports.register = async (req, res, next) => {
  try {
    let user = req.body;
    let cryptedPassword = await bcrypt.hash(user.password, 10);

    // create new user
    const newUser = new User({
      _id: new ObjectId(),
      email: user.email,
      fullName: user.fullName,
      password: cryptedPassword,
    });

    // save new user and respond
    let result = await newUser.save();
    return result != null
      ? res.status(httpStatus.CREATED).json({
          message: "Created user successfully",
          user: newUser.fullName,
        })
      : next({
          message: "Something went wrong",
          status: httpStatus.BAD_REQUEST,
        });
  } catch (error) {
    return next(error);
  }
};
// #endregion

// #region  users login operation is here
/*
 * @body
 *   {
 *     email: string
 *     password: string
 *   }
 *
 * @public POST /api/login
 * */
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
          _id: foundUser.id,
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
// #endregion
