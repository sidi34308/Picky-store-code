const express = require("express");
const { upload } = require("../../helpers/s3");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // Ensure this is correctly imported
  sendOrderEmail,
} = require("../../controllers/common/feature-controller");

const router = express.Router();
console.log("Feature routes loaded");
router.post("/add", upload.single("image"), addFeatureImage);

router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage); // Ensure this route uses the correct function

router.post("/sendOrderEmail", sendOrderEmail);

module.exports = router;
