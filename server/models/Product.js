const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productId: String,
    images: [String], // Change 'image' to 'images' and make it an array of strings
    title: String,
    description: String,
    category: String,
    labels: String,
    group: Boolean, //
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
