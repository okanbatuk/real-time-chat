const jwt = require("jsonwebtoken"),
  {
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY,
  } = require("../config/vars.js");

exports.generateAccessToken = async (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15s",
  });
};

exports.generateRefreshToken = async (user) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "2h",
  });
};
