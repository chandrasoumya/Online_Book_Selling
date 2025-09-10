const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FName: {
    type: String,
    required: true,
  },
  LName: {
    type: String,
    required: true,
  },
  Mobile: {
    type: String,
    required: true,
    unique: true,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["Customer", "Admin", "Library"],
    default: "Customer",
  },
  Address: [
    {
      State: String,
      District: String,
      Town: String,
      PinCode: Number,
    },
  ],
  Cart: [
    {
      bookId: {
        type: mongoose.Schema.Types.String,
        ref: "books",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
