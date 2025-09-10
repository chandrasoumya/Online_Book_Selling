import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(useLocation().search).get("query");
  const searchBy = new URLSearchParams(useLocation().search).get("searchBy");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let endpoint = "";
        if (searchBy === "title") {
          endpoint = `${process.env.REACT_APP_API_URL}/books/title/${encodeURIComponent(query)}`;
        } else if (searchBy === "author") {
          endpoint = `${process.env.REACT_APP_API_URL}/books/author/${encodeURIComponent(query)}`;
        } else if (searchBy === "genre") {
          endpoint = `${process.env.REACT_APP_API_URL}/books/genre/${encodeURIComponent(query)}`;
        }

        const response = await axios.get(endpoint);

        if (response.data.length === 0) {
          // No books found
          setError("No books found.");
        } else {
          setBooks(response.data);
          setError(null); // Clear any previous error messages
        }
        setLoading(false);
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, searchBy]);

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default SearchResults;
