import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [bookDetails, setBookDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${user.Email}/cart`
      );
      setCartItems(response.data.cart);
      fetchBookDetails(response.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchBookDetails = async (cartItems) => {
    setIsLoading(true);
    const bookIds = cartItems.map((item) => item.bookId);
    const promises = bookIds.map((bookId) =>
      axios.get(`${process.env.REACT_APP_API_URL}/books/id/${bookId}`).catch((error) => {
        if (error.response.status === 404) {
          console.log(`Book not found: ${bookId}`);
          return null;
        } else {
          throw error;
        }
      })
    );
    const responses = await Promise.all(promises);
    const details = responses.reduce((acc, response) => {
      if (response && response.data) {
        acc[response.data.bookId] = response.data;
      }
      return acc;
    }, {});
    setBookDetails(details);
    setIsLoading(false);
  };

  const handleQuantityChange = async (bookId, quantity) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.Email}/cart`, {
        bookId,
        quantity,
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/${user.Email}/cart/${bookId}`
      );
      fetchCart();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total +
          (bookDetails[item.bookId]
            ? bookDetails[item.bookId].price * item.quantity
            : 0),
        0
      )
      .toFixed(2);
  };

  const handleCheckout = () => {
    const checkoutItems = cartItems.map((item) => ({
      title: bookDetails[item.bookId]?.title,
      quantity: item.quantity,
      bookId: item.bookId,
      price: bookDetails[item.bookId]?.price,
    }));
    const total = calculateTotal();
    navigate("/order", { state: { checkoutItems, total, customerEmail: user?.Email } });
  };

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.bookId}
              className="flex justify-between items-center mb-4 shadow-md shadow-gray-500 border-t-[1px] border-gray-300 p-2 rounded-md"
            >
              {bookDetails[item.bookId] ? (
                <div className="flex items-center">
                  <img
                    src={bookDetails[item.bookId].img}
                    alt={bookDetails[item.bookId].title}
                    className="w-[100px] h-[150px] mr-4"
                  />
                  <div>
                    <h2 className="font-bold text-xl">
                      {bookDetails[item.bookId].title}
                    </h2>
                    <p className="text-md">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              <div>
                {bookDetails[item.bookId] ? (
                  <p className="font-bold">
                    ${bookDetails[item.bookId].price.toFixed(2)}
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="flex space-x-2">
                  <button
                    className="bg-red-400 p-2 rounded-md hover:bg-red-500"
                    onClick={() =>
                      handleQuantityChange(item.bookId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <button
                    className="bg-green-400 p-2 rounded-md hover:bg-green-500"
                    onClick={() =>
                      handleQuantityChange(item.bookId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="bg-yellow-400 p-2 rounded-md hover:bg-yellow-500"
                    onClick={() => handleRemoveItem(item.bookId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <br></br>
          <div className="mt-4">
            <p className="font-bold">Total: ${calculateTotal()}</p>
            <br></br>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white font-semibold p-2 rounded hover:bg-blue-700 w-full"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
