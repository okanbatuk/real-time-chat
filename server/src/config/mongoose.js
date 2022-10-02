const mongoose = require("mongoose"),
  { mongo } = require("../config/vars.js");

// Exit app on error
mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

// connect to mongo db
exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("mongoDB connected"))
    .catch((err) => console.error(err));
  // return mongoose.connection;
};
