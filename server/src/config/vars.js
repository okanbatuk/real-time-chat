const path = require("path");

// import env variables from .env file
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

module.exports = {
  host: process.env.HOST,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGODB,
  },
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
};
