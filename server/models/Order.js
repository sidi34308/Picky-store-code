const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // Add orderId field
  fullName: String,
  email: String,
  age: Number,
  birthDate: Date,
  phone: String,
  address: String,
  region: String,
  notes: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  orderStatus: String,
  totalAmount: Number,
  orderDate: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
