import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewOrderPage = () => {
  const { state } = useLocation();
  const { checkoutItems, total, shippingDetails, customerEmail } = state || {};

  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    try {
      // Prepare order data
      const orderData = {
        shippingDetails: {
          name: shippingDetails.name,
          address: shippingDetails.address,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          phoneNumber: shippingDetails.phoneNumber,
        },
        checkoutItems: checkoutItems.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          bookId: item.bookId,
          price: item.price,
        })),
        totalAmount: total,
        customerEmail,
      };


      // Send order data to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, orderData);

    
      if (response.status === 201) {
        alert("Order confirmed!");
      } else {
        alert("Error placing the order. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || "";
      if (status === 400 && (msg.includes("Insufficient stock") || msg.includes("out of stock") || msg.includes("out of Stock"))) {
        alert("Stock is less than items selected. Please reduce quantity.");
      } else if (typeof msg === "string" && msg) {
        alert(msg);
      } else {
        alert("There was an issue confirming your order. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Review Your Order</h1>
      <h2 className="text-xl font-semibold">Shipping Details</h2>
      <div className="mb-4 bg-white p-4 rounded shadow-md">
        <p>
          <strong>Name:</strong> {shippingDetails.name}
        </p>
        <p>
          <strong>Address:</strong> {shippingDetails.address}
        </p>
        <p>
          <strong>City:</strong> {shippingDetails.city}
        </p>
        <p>
          <strong>Postal Code:</strong> {shippingDetails.postalCode}
        </p>
        <p>
          <strong>Phone Number:</strong> {shippingDetails.phoneNumber}
        </p>
      </div>

      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="bg-white p-4 rounded shadow-md">
        {checkoutItems.map((item, index) => (
          <div key={index} className="border-b border-gray-300 py-2">
            <p>
              <strong>Title:</strong> {item.title}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p>
              <strong>Price:</strong> ${item.price}
            </p>
          </div>
        ))}
        <p className="font-bold mt-4">Total: ${total}</p>
      </div>

      <button
        onClick={handleConfirmOrder}
        className="w-full p-2 mt-4 bg-green-600 font-semibold text-white rounded hover:bg-green-700"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default ReviewOrderPage;
