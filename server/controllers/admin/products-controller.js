const Product = require("../../models/Product");

const { imageUploadUtil } = require("../../helpers/s3");

const handleImageUpload = async (req, res) => {
  try {
    const result = await imageUploadUtil(req.files);

    res.json({
      success: true,
      urls: result.map((r) => r.url), // Return an array of URLs
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};
// add a new product
const addProduct = async (req, res) => {
  try {
    // console.log("Files received:", req.body); // Debugging step

    const {
      images,
      title,
      description,
      category,
      labels,
      group,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    // // If images are not URLs, upload them
    // if (
    //   !Array.isArray(images) ||
    //   images.some((url) => !url.startsWith("http"))
    // ) {
    //   const imageUploadResult = await imageUploadUtil(req.files);
    //   images = imageUploadResult.map((r) => r.url); // Use the URLs from the image upload
    // }

    const newlyCreatedProduct = new Product({
      images, // Store multiple image URLs
      title,
      description,
      category,
      labels,
      group,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();

    res.json({
      success: true,
      product: newlyCreatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      labels,
      group,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.labels = labels || findProduct.labels;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
