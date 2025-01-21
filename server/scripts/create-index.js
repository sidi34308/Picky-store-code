const mongoose = require("mongoose");
const Product = require("../models/Product");

const createIndex = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sidi34308s:Sidi12345@cluster0.utxr8.mongodb.net/"
    );

    await Product.collection.createIndex(
      { title: "text", description: "text", category: "text", labels: "text" },
      { weights: { title: 5, description: 2, category: 1, labels: 1 } }
    );

    console.log("Index created successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating index:", error);
    mongoose.connection.close();
  }
};

createIndex();
