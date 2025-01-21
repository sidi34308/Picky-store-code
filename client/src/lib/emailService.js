import axios from "axios";

export async function sendOrderEmail(newOrder) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/sendOrderEmail",
      {
        to: "sidi34308s@gmail.com",
        subject: "New Order Received",
        orderDetails: newOrder,
      }
    );
    console.log("Order email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending order email:", error);
    throw error;
  }
}
