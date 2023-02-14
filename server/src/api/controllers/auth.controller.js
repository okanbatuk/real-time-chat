const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/user.model.js");
const tokens = require("../../config/passport.js");

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
          message: "User created successfully",
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
    let isMatch = false;
    let { email, password } = req.body;
    let foundUser = await User.findOne({ email: { $eq: email } });
    isMatch = foundUser && bcrypt.compare(password, foundUser.password);
    if (foundUser && isMatch) {
      foundUser.isActive = true;
      foundUser.save();
      let accessToken = await tokens.generateAccessToken({
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
