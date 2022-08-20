const express = require("express"),
  http = require("http"),
  app = require("./config/express.js"),
  { host, port } = require("./config/vars"),
  { connect } = require("./config/mongoose.js");

// Server configuration and build
const server = http.createServer(app);
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server running at http://${host}:${port}`);
  connect();
});
