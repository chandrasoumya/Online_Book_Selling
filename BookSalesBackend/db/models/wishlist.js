const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    }, // User's email for identifying the wishlist owner
    mobile: {
      type: String,
      required: true,
    }, // User's mobile number
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.String,
          ref: "books",
          required: true,
        },
        title: {
          type: String,
          required: true,
        }, // Title of the book
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
