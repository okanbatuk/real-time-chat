const mongoose = require("mongoose"),
  httpStatus = require("http-status"),
  bcrypt = require("bcrypt"),
  User = require("../models/user.model.js");

exports.getAllUsers = async (req, res, next) => {
  try {
    let docs = await User.find(/* { isActive: true } */);
    return docs
      ? res.status(httpStatus.OK).json({ userCount: docs.length, users: docs })
      : next({
          message: "Something went wrong",
          status: httpStatus.BAD_REQUEST,
        });
  } catch (error) {
    return next(error);
  }
};

// Registration section for users
exports.register = async (req, res, next) => {
  try {
    let user = req.body;
    let cryptedPassword = await bcrypt.hash(user.password, 10);

    // create new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
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

// Get user Function
exports.getUser = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;
    let doc = await User.findById(id).where("isActive", true);
    return doc
      ? res
          .status(httpStatus.OK)
          .json({ id: doc._id, email: doc.email, fullName: doc.fullName })
      : next({
          status: httpStatus.NOT_FOUND,
          message: "User not found",
        });
  } catch (error) {
    return next(error);
  }
};

// Update user's information this section
exports.updateInfo = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`,
      email = `${req.body.email}`;

    let user = await User.findOne({ email: { $eq: email } });
    if (user && id != user._id) {
      let error = {
        message: "Email address already in use",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    } else {
      let doc = await User.updateOne(
        { _id: id, isActive: true },
        { $set: { email: req.body.email, fullName: req.body.fullName } }
      );
      return doc.modifiedCount > 0
        ? res
            .status(httpStatus.OK)
            .json({ message: "Update is successful", status: httpStatus.OK })
        : next({
            message: "Nothing has been changed",
            status: httpStatus.BAD_REQUEST,
          });
    }
  } catch (error) {
    return next(error);
  }
};

// this section is update user password
exports.updatePassword = async (req, res, next) => {
  try {
    let id = `${req.user.UserInfo._id}`,
      currentPassword = `${req.body.currentPassword}`,
      newPassword = await bcrypt.hash(req.body.newPassword, 10);

    let doc = await User.findById(id).where("isActive", true);
    let check = await bcrypt.compare(currentPassword, doc.password);
    if (check) {
      doc.password = newPassword;
      let user = await doc.save();
      return user
        ? res.status(httpStatus.OK).json({
            message: "Account has been updated successfully",
            status: httpStatus.OK,
          })
        : next({
            message: "Something went wrong",
            status: httpStatus.InternalServerError,
          });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Current password is incorrect",
        status: httpStatus.BAD_REQUEST,
      });
    }
  } catch (error) {
    return next(error);
  }
};

// there is users deletion in this section
exports.deleteUser = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;
    let match = mongoose.Types.ObjectId.isValid(id);
    if (match) {
      let doc = await User.updateOne(
        { _id: id },
        { $set: { isActive: false } }
      );
      return doc.modifiedCount > 0
        ? res.status(httpStatus.OK).json({
            message: "User deletion successful",
            status: httpStatus.OK,
          })
        : next({
            message: "User deletion failed",
            status: httpStatus.BAD_REQUEST,
          });
    }
  } catch (error) {
    return next(error);
  }
};
