const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload, imageUploadUtil } = require("../../helpers/s3");

const router = express.Router();

router.post("/upload-image", upload, async (req, res) => {
  try {
    const result = await imageUploadUtil(req.files);
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

module.exports = router;
