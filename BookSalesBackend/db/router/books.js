const express = require("express");
const router = express.Router();
const Book = require("../models/book"); // Adjust path as needed

// GET recommended books (random in-stock selection)
router.get("/recommendations", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 8, 20));
    const pipeline = [
      { $match: { stock: { $gt: 0 } } },
      { $sample: { size: limit } },
      {
        $project: {
          _id: 0,
          bookId: 1,
          title: 1,
          author: 1,
          img: 1,
          price: 1,
          stock: 1,
        },
      },
    ];
    const recs = await Book.aggregate(pipeline);
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recommendations: " + err.message });
  }
});

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books: " + err.message });
  }
});

// GET bestsellers books
router.get("/bestsellers", async (req, res) => {
  try {
    const bestsellers = await Book.find({ bestsellers: true });
    res.json(bestsellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a book by ID
router.get("/id/:id", async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET books by Title
router.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title.replace(/_/g, " ");
    const books = await Book.find({ title: new RegExp(title, "i") });
    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the given title" });
    }
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET books by Author
router.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author.replace(/_/g, " ");
    const books = await Book.find({ author: new RegExp(author, "i") });
    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the given author" });
    }
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET books by Genre (Category)
router.get("/genre/:genre", async (req, res) => {
  try {
    const genre = req.params.genre.replace(/_/g, " ");
    const books = await Book.find({ category: new RegExp(genre, "i") }); // Use category for genre search
    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found in the given genre" });
    }
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
