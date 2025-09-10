const mongoose = require("mongoose");

// Connecting to the database
const mongoUrl = process.env.URL || "mongodb://127.0.0.1:27017/booksales";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected to " + mongoUrl);
  })
  .catch((err) => {
    console.log(err);
  });
