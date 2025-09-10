import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bestsellers = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        // Fetch only bestseller books from backend
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/bestsellers`);
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching bestsellers");
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  if (loading) return <p>Loading bestsellers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="py-10 bg-white" id="bestsellers">
      <h2 className="text-3xl font-bold text-center mb-6">Bestsellers</h2>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div
            key={book.bookId}
            className={`text-center cursor-pointer transform hover:scale-105 transition-transform duration-300 relative ${
              book.stock === 0 ? "opacity-50" : ""
            }`}
            onClick={() => handleBookClick(book.bookId)}
          >
            <div className="relative">
              <img
                src={book.img || "https://via.placeholder.com/150"}
                alt={book.title}
                className="mx-auto mb-4 h-[300px] w-[250px] object-cover"
              />
              {book.stock === 0 && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-10 flex items-center justify-center">
                  <p className="text-white text-lg font-bold">Out of Stock</p>
                </div>
              )}
            </div>
            <p className="text-lg font-semibold">{book.title}</p>
            <p className="font-bold text-xl text-blue-600">
              ${book.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Bestsellers;
