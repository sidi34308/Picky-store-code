import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function sendOrderEmail(newOrder) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sendOrderEmail`, {
      to: "sidi34308s@gmail.com",
      subject: "New Order Received",
      orderDetails: newOrder,
    });
    console.log("Order email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending order email:", error);
    throw error;
  }
}
