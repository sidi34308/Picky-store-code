const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  handleFeatureImageUpload,
  handleFeatureImageDelete,
} = require("../controllers/admin/products-controller");
const authenticateToken = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload-feature-image",
  authenticateToken,
  upload.single("file"),
  handleFeatureImageUpload
);
router.post(
  "/delete-feature-image",
  authenticateToken,
  handleFeatureImageDelete
);

module.exports = router;
