import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderPage = () => {
  const { state } = useLocation();
  const { checkoutItems, total, customerEmail } = state || {};
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/review-order", {
      state: { checkoutItems, total, shippingDetails, customerEmail },
    });
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-900">Name</label>
          <input
            type="text"
            name="name"
            value={shippingDetails.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={shippingDetails.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={shippingDetails.city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={shippingDetails.postalCode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={shippingDetails.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full p-2 mt-4 bg-blue-600 font-semibold text-white  rounded hover:bg-blue-700"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
