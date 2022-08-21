const mongoose = require("mongoose");

/*
 * User Roles
 */
/* const roles = ["user", "admin"]; */

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  fullName: {
    type: String,
    required: true,
    maxlength: 128,
    index: true,
    trim: true,
  },
  /* role: {
    type: String,
    enum: roles,
    default: "user",
  }, */
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
