const express = require("express"),
  morgan = require("morgan"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  routes = require("../api/routes"),
  error = require("../api/middlewares/errors.js");

const app = express();

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
