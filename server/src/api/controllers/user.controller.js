const httpStatus = require("http-status"),
  bcrypt = require("bcrypt"),
  User = require("../models/user.model.js");

//#region Load all users
/*
 *
 *@public GET /api/users
 */
exports.getAllUsers = async (req, res, next) => {
  let users = await User.find(/* { isActive: true } */);
  return res
    .status(httpStatus.OK)
    .json({ userCount: users.length, users: users });
};
//#endregion

//#region Get User Information
/*
 *
 * @public GET /api/users/:userId
 *
 */
exports.getUser = async (req, res, next) => {
  let id = `${req.params.userId}`;
  let doc = await User.findById({ _id: { $eq: id }, isActive: true });
  return doc
    ? res
        .status(httpStatus.OK)
        .json({ id: doc._id, email: doc.email, fullName: doc.fullName })
    : next({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
};
//#endregion

//#region Update user's information
/*
 * @params {ObjectId} userId
 * @body {String} email
 * @body {String} fullName
 *
 * @public POST /api/users/:userId
 *
 */
exports.updateInfo = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`,
      email = `${req.body.email}`,
      error = "";

    // TODO: use user.findOne with id params Instead  of email params
    let user = await User.findOne({ _id: { $eq: id }, isActive: true });

    if (user !== null) {
      let conflictUser = await User.findOne({
        email: { $eq: email },
      });
      if (conflictUser !== null && id !== conflictUser.id) {
        error = {
          message: "This mail already in use",
          status: httpStatus.BAD_REQUEST,
        };
        return next(error);
      }
      let doc = await User.updateOne(
        { _id: id, isActive: true },
        { $set: { email: email, fullName: req.body.fullName } }
      );
      return doc.modifiedCount > 0
        ? res
            .status(httpStatus.OK)
            .json({ message: "Update is successful", status: httpStatus.OK })
        : next({
            message: "Nothing has been changed",
            status: httpStatus.BAD_REQUEST,
          });
    } else {
      error = {
        message: "User not found",
        status: httpStatus.NOT_FOUND,
      };
      return next(error);
    }

    // TODO: user is null when return error
  } catch (error) {
    return next(error);
  }
};
//#endregion

//#region Update user password
/*
 * @req.user decoded from checkAuth.js
 * @body {String} currentPassword
 * @body {String} newPassword
 *
 * @public POST /api/users/update-password
 */
exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.user);
    let id = `${req.user._id}`,
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
            savedUser: user,
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
//#endregion

//#region Delete users process
/*
 * @params {ObjectId} userId
 *
 * @public DELETE /api/users/:userId
 */
exports.deleteUser = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;
    let doc = await User.updateOne({ _id: id }, { $set: { isActive: false } });
    return doc.modifiedCount > 0
      ? res.status(httpStatus.OK).json({
          message: "User deletion successful",
          status: httpStatus.OK,
        })
      : next({
          message: "User deletion failed",
          status: httpStatus.BAD_REQUEST,
        });
  } catch (error) {
    return next(error);
  }
};
//#endregion
