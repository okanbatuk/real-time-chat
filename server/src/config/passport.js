const jwt = require("jsonwebtoken"),
  {
    ACCESS_TOKEN_SECRET_KEY,
    // TODO: REFRESH_TOKEN_SECRET_KEY,
  } = require("../config/vars.js");

//#region Access Token is handled in this section
/*
 *
 * @private
 */
exports.generateAccessToken = async (userInfo) => {
  return jwt.sign(userInfo, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "2h",
  });
};
//#endregion

// TODO: refresh token will be handled
/* exports.generateRefreshToken = async (user) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "2h",
  });
}; */
