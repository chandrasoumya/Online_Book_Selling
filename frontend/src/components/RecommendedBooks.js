import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/books/recommendations?limit=8"
        );
        setBooks(response.data || []);
        setLoading(false);
      } catch (err) {
        setError("Error fetching recommendations");
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  if (loading) return null;
  if (error) return null;

  return (
    <section className="py-10 bg-blue-900 text-white" id="recommendation">
      <h2 className="text-3xl font-bold text-center mb-6">
        This Month's Recommended Books
      </h2>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div
            key={book.bookId}
            className="text-center cursor-pointer"
            onClick={() => handleBookClick(book.bookId)}
          >
            <img
              src={book.img || "book.webp"}
              alt={book.title}
              className="mx-auto mb-4 h-[300px] w-[250px] object-cover"
            />
            <p>{book.title}</p>
            <p className="font-bold">${Number(book.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedBooks;
