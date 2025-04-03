const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
  toggleProductVisibility, // Import the new controller function
} = require("../../controllers/admin/products-controller");

const { upload, imageUploadUtil } = require("../../helpers/s3");

const router = express.Router();

router.post("/upload-image", upload.array("files", 10), async (req, res) => {
  try {
    const result = await imageUploadUtil(req.files); // req.files for multiple files
    res.json({
      success: true,
      urls: result.map((r) => r.url),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
});
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.patch("/:id/visibility", toggleProductVisibility); // Add the new endpoint

module.exports = router;
