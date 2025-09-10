const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist"); // Adjust path as needed
const Book = require("../models/book");
const twilio = require("twilio");

const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM; // E.164 phone number (e.g., +14155552671)
const twilioMessagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; // optional
let twilioClient = null;
if (twilioSid && twilioToken) {
  twilioClient = twilio(twilioSid, twilioToken);
}
if (!twilioSid || !twilioToken) {
  console.warn(
    "Twilio is not fully configured: TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing. SMS will be skipped."
  );
}

function isE164PhoneNumber(value) {
  return typeof value === "string" && /^\+[1-9]\d{1,14}$/.test(value);
}

// GET all wishlist items for a user by email
router.get("/wishlist/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const wishlist = await Wishlist.findOne({ email });
    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "No wishlist found for this email" });
    }
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist: " + err.message });
  }
});

// POST add a new item to wishlist
router.post("/wishlist", async (req, res) => {
  try {
    const { email, mobile, bookId, title } = req.body;

    let wishlist = await Wishlist.findOne({ email });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({
        email,
        mobile,
        items: [{ bookId, title }],
      });
    } else {
      // Check if the item already exists in the wishlist
      const itemExists = wishlist.items.some(
        (item) => item.bookId.toString() === bookId
      );

      if (itemExists) {
        return res.status(400).json({ message: "Item already in wishlist" });
      }

      // Add the new item to the wishlist
      wishlist.items.push({ bookId, title });
    }

    const savedWishlist = await wishlist.save();

    // If book is in stock, send SMS notification
    try {
      if (twilioClient && mobile) {
        const book = await Book.findOne({ bookId });
        if (book && book.stock > 0) {
          if (!isE164PhoneNumber(mobile)) {
            console.warn(
              "Twilio: provided mobile is not in E.164 format. Skipping SMS.",
              { mobile }
            );
          } else {
            const messagePayload = {
              body: `Good news! '${book.title}' is in stock now at BookSales. Price: $${book.price}.`,
              to: mobile,
            };
            if (twilioMessagingServiceSid) {
              messagePayload.messagingServiceSid = twilioMessagingServiceSid;
            } else if (twilioFrom) {
              messagePayload.from = twilioFrom;
            } else {
              console.warn(
                "Twilio is configured but neither TWILIO_MESSAGING_SERVICE_SID nor TWILIO_FROM is set. Skipping SMS."
              );
            }

            if (messagePayload.messagingServiceSid || messagePayload.from) {
              await twilioClient.messages.create(messagePayload);
            }
          }
        }
      }
    } catch (smsErr) {
      // Log and continue without failing the API
      console.error("Twilio SMS error:", smsErr.message || smsErr);
    }

    res.status(201).json(savedWishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist: " + err.message });
  }
});

// DELETE an item from wishlist by bookId
router.delete("/wishlist/:email/:bookId", async (req, res) => {
  try {
    const { email, bookId } = req.params;

    const wishlist = await Wishlist.findOne({ email });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Ensure consistent comparison regardless of type
    wishlist.items = wishlist.items.filter(
      (item) => String(item.bookId) !== String(bookId)
    );
    const updatedWishlist = await wishlist.save();
    res.json({
      message: "Item removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting item from wishlist: " + err.message });
  }
});

module.exports = router;
