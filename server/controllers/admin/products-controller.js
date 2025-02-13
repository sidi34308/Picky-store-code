const Product = require("../../models/Product");

const { imageUploadUtil, uploadFeatureImage } = require("../../helpers/s3");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

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

const handleFeatureImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided for upload.",
      });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG and PNG images are allowed.",
      });
    }

    const result = await uploadFeatureImage(req.file);

    res.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred during upload.",
    });
  }
};

const handleFeatureImageDelete = async (req, res) => {
  try {
    const { key } = req.body;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    res.json({
      success: true,
      message: "Feature image deleted successfully",
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
  handleFeatureImageUpload,
  handleFeatureImageDelete,
};
