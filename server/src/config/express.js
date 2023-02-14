const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("../api/routes");
const error = require("../api/middlewares/errors.js");
const { connect } = require("../config/mongoose");

const app = express();

connect();

// Request logging level
app.use(morgan("dev"));

// Cross Origin Resource Sharing
app.use(cors());

// Parse body params and attach them to req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes is here
app.use("/api", routes);

//if error is not an instanceof APIError
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

//error handler will be called
app.use(error.handler);

module.exports = app;
