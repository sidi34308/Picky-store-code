const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  sendOrderEmail,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

router.post("/sendOrderEmail", sendOrderEmail);

module.exports = router;
