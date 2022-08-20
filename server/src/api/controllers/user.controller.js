const httpStatus = require("http-status"),
  mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  User = require("../models/user.model.js");

exports.getAllUsers = async (req, res, next) => {
  try {
    let result = await User.find(/* { isActive: true } */)
      .select("_id email fullName password isActive")
      .exec()
      .then((docs) => {
        let response = {
          count: docs.length,
          users: docs,
        };
        return response;
      });
    return result;
  } catch (error) {
    return next(error);
  }
};

// Registration section for users
exports.register = async (req, res, next) => {
  try {
    let cryptedPassword = await bcrypt.hash(req.body.password, 10);
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      fullName: req.body.fullName,
      password: cryptedPassword,
    });
    let result = await user.save().then((docs) => {
      let response = {
        fullName: docs.fullName,
        _id: docs._id,
        password: docs.password,
        isActive: docs.isActive,
      };
      return response;
    });
    return result;
  } catch (error) {
    return next(error);
  }
};

// users login operation is here
exports.login = async (req, res, next) => {
  try {
    let password = `${req.body.password}`;
    let user = await User.findOne({ email: req.body.email })
      .where("isActive", true)
      .exec()
      .then((docs) => {
        let response = {
          _id: docs._id,
          email: docs.email,
          fullName: docs.fullName,
          password: docs.password,
          isActive: docs.isActive,
        };
        return response;
      });
    let check = await bcrypt.compare(password, user.password);
    if (check) return user;
    return null;
  } catch (error) {}
};

// Get user Function
exports.getUser = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;
    let result = await User.findById(id)
      .select("_id email password fullName isActive")
      .where("isActive", "true")
      .exec()
      .then((doc) => {
        return doc;
      });
    return result;
  } catch (error) {
    return next(error);
  }
};

// Update user's information this section
exports.updateInfo = async (req, res, next) => {
  try {
    let id = `${req.params.userId}`;

    let result = await User.updateOne(
      { _id: id },
      { $set: { email: req.body.email, fullName: req.body.fullName } }
    ).then((doc) => {
      return doc;
    });
    return result;
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
    let result = await User.updateOne(
      { _id: id },
      { $set: { isActive: false } }
    ).then((doc) => {
      return doc;
    });
    return result;
  } catch (error) {
    return next(error);
  }
};
