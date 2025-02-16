const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productId: String,
    images: [String], // Change 'image' to 'images' and make it an array of strings
    title: String,
    description: String,
    category: [String], // Change 'category' to be an array of strings
    labels: String,
    group: Boolean, //
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    hidden: Boolean, // Add the hidden field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
