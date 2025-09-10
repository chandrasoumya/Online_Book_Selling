const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerEmail: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.String,
          ref: "books",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    }, // Order status like Pending, Shipped, Delivered
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
