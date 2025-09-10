import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaHome,
  FaBook,
  FaStar,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons
import { BiSearchAlt2 } from "react-icons/bi"; // Search icon

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      alert("Please enter a value to search.");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/${searchBy}/${encodeURIComponent(searchQuery)}`
      );

      navigate(
        `/search?query=${encodeURIComponent(searchQuery)}&searchBy=${searchBy}`
      );
      setSearchQuery("");
    } catch (err) {
      console.error("Error searching for books:", err);
      alert("An error occurred while searching. Please try again.");
    }
  };

  return (
    <header className="bg-blue-900 text-white p-4 text-xl">
      <nav className="flex justify-between items-center flex-wrap">
        <div className="text-2xl font-bold mr-8">THE LIBRARIANS</div>
        <ul className="flex space-x-4 ">
          <li>
            <Link to="/" className="hover:text-gray-400 flex items-center">
              <FaHome className="mr-1" /> Home
            </Link>
          </li>
          <li>
            <Link to="/#bestsellers" className="hover:text-gray-400 flex items-center">
              <FaStar className="mr-1" /> Bestsellers
            </Link>
          </li>
          <li>
            <Link to="/#recommendation" className="hover:text-gray-400 flex items-center">
              <FaBook className="mr-1" /> Month's Recommendation
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-gray-400 flex items-center"
                >
                  <FaUser className="mr-1" /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-400 flex items-center"
                >
                  <FaSignOutAlt className="mr-1" /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="hover:text-gray-400 flex items-center"
              >
                <FaSignInAlt className="mr-1" /> Login
              </Link>
            </li>
          )}
          {/* Cart Icon */}
          <Link to="/cart" className="hover:text-gray-400 ml-4 flex gap-1">
            <FaShoppingCart size={24} /> Cart
          </Link>
        </ul>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4 flex items-center">
          <select
            className="p-2 text-white font-semibold rounded mr-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </select>
          <input
            type="text"
            className="p-2 text-black rounded"
            placeholder={`Search by ${searchBy}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded ml-2 flex items-center"
          >
            <BiSearchAlt2 className="mr-1" /> Search
          </button>
        </form>
      </nav>
    </header>
  );
};

export default Header;
