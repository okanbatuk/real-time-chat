const mongoose = require("mongoose"),
  httpStatus = require("http-status"),
  bcrypt = require("bcrypt"),
  User = require("../models/user.model.js");

exports.getAllUsers = async (req, res, next) => {
  try {
    User.find(/* { isActive: true } */)
      .select("_id email fullName password isActive")
      .exec()
      .then((docs) => {
        let response = {
          count: docs.length,
          users: docs,
        };
        return res.status(httpStatus.OK).json(response);
      });
  } catch (error) {
    return next(error);
  }
};

// Registration section for users
exports.register = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.fullName) {
      let error = {
        message: "Please enter all required fields.",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    }
    User.findOne({ email: req.body.email })
      .exec()
      .then(async (result) => {
        if (!(result instanceof User)) {
          let cryptedPassword = await bcrypt.hash(req.body.password, 10);
          let user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            fullName: req.body.fullName,
            password: cryptedPassword,
          });
          user.save().then((docs) => {
            if (docs != null && !(docs instanceof Error)) {
              return res.status(httpStatus.CREATED).json({
                message: "Created user successfully",
                user: docs.fullName,
              });
            }
          });
        } else {
          let error = {
            message: "Email has already been used",
            status: httpStatus.CONFLICT,
          };
          return next(error);
        }
      })
      .catch((err) => {
        return next(err);
      });
  } catch (error) {
    return next(error);
  }
};

// Get user Function
exports.getUser = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;
    User.findById(id)
      .select("_id email fullName")
      .where("isActive", "true")
      .exec()
      .then((doc) => {
        if (doc) {
          return res.status(httpStatus.OK).json(doc);
        }
        let error = {
          status: httpStatus.NOT_FOUND,
          message: "User not found",
        };
        return next(error);
      });
  } catch (error) {
    return next(error);
  }
};

// Update user's information this section
exports.updateInfo = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.fullName) {
      let error = {
        message: "Please enter all required fields.",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    }
    let id = `${req.params.userId}`,
      email = `${req.body.email}`;
    let match = await User.findOne({ email: { $eq: email } })
      .exec()
      .then((doc) => {
        if (doc != null && id != doc._id) return true;
        return false;
      });
    if (!match) {
      User.updateOne(
        { _id: id, isActive: true },
        { $set: { email: req.body.email, fullName: req.body.fullName } }
      ).then((doc) => {
        if (doc.modifiedCount > 0) {
          return res
            .status(httpStatus.OK)
            .json({ message: "Update is successful", status: httpStatus.OK });
        }
        let error = {
          message: "Nothing has been changed",
          status: httpStatus.BAD_REQUEST,
        };
        return next(error);
      });
    } else {
      let error = {
        message: "Email address already in use",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

// TODO: this section is gonna update user password
/* exports.updatePassword = async (req, res, next) => {
  try {
    let id = `${req.body.userId}`,
      oldPass = `${req.body.oldPassword}`,
      newPass = `${req.body.newPassword}`;
    
    let result = 
      await User
        .findById(id)
        .where("isActive",true)
        .exec()
        .then((doc) => {
          let check = await bcrypt.compare(oldPass, doc.password);
          if(check) {
            
          }
        })

  } catch (error) {}
}; */

// there is users deletion in this section
exports.deleteUser = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;
    let match = mongoose.Types.ObjectId.isValid(id);
    if (match) {
      User.updateOne({ _id: id }, { $set: { isActive: false } }).then((doc) => {
        if (doc.modifiedCount > 0) {
          return res.status(httpStatus.OK).json({
            message: "User deletion successful",
            status: httpStatus.OK,
          });
        }
        let error = {
          message: "User deletion failed",
          status: httpStatus.BAD_REQUEST,
        };
        return next(error);
      });
    } else {
      let error = {
        message: "User deletion failed",
        status: httpStatus.BAD_REQUEST,
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};
