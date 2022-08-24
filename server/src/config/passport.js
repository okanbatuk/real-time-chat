const jwt = require("jsonwebtoken"),
  {
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY,
  } = require("../config/vars.js");

// Access Token is handled in this section
exports.generateAccessToken = async (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "2h",
  });
};

// TODO: refresh token will be handled
/* exports.generateRefreshToken = async (user) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "2h",
  });
}; */
