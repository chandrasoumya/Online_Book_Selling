const express = require("express");
const router = express.Router();
const Order = require("../models/order"); // Adjust path as needed
const Book = require("../models/book");

// GET all orders
router.get("/orders/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.bookId"); // Fetch all orders and populate book details
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders: " + err.message });
  }
});

// GET an order by ID
router.get("/orders/id/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.bookId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET orders by customer email
router.get("/orders/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the given email" });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new order
router.post("/orders/", async (req, res) => {
  try {
    const {
      shippingDetails: { name, address, city, postalCode, phoneNumber },
      checkoutItems,
      totalAmount,
      customerEmail,
    } = req.body;

    // Basic validation
    if (!customerEmail) {
      return res.status(400).json({ message: "customerEmail is required" });
    }
    if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) {
      return res.status(400).json({ message: "checkoutItems is required" });
    }

    // Ensure the totalAmount is a number, convert if necessary
    const totalAmountNumber = Number.parseFloat(totalAmount);
    if (Number.isNaN(totalAmountNumber)) {
      return res.status(400).json({ message: "totalAmount must be a number" });
    }

    // Validate stock for each item
    const items = [];
    for (const item of checkoutItems) {
      const book = await Book.findOne({ bookId: item.bookId });
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.bookId}` });
      }
      if (book.stock <= 0) {
        return res
          .status(400)
          .json({ message: `Book out of stock: ${book.title}` });
      }
      if (item.quantity > book.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${book.title}. Available: ${book.stock}`,
        });
      }
      items.push({
        bookId: item.bookId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Create a new order document
    const newOrder = new Order({
      customerEmail,
      customerName: name,
      shippingAddress: address,
      city,
      postalCode,
      phoneNumber,
      items,
      totalAmount: totalAmountNumber,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Decrement stock for ordered items
    for (const item of items) {
      await Book.updateOne(
        { bookId: item.bookId },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an order
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Restock the items
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        try {
          await Book.updateOne(
            { bookId: item.bookId },
            { $inc: { stock: item.quantity } }
          );
        } catch (e) {
          console.error("Failed to restock bookId", item.bookId, e?.message || e);
        }
      }
    }
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully and stock restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
