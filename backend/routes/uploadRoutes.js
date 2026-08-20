const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Property = require("../models/Property");

// ===== UPLOAD PROPERTY =====
router.post(
  "/upload",
  protect,
  upload.array("images", 10),
  async (req, res) => {
    try {
      console.log("📸 Files received:", req.files ? req.files.length : 0);
      console.log("📦 Body keys:", Object.keys(req.body));

      // Build image paths
      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map((file) => `uploads/${file.filename}`);
        console.log("📸 Image paths:", imagePaths);
      } else {
        console.warn("⚠️ No images uploaded");
      }

      // Create property with or without images
      const propertyData = {
        ...req.body,
        images: imagePaths,
        owner: req.user._id,
        latitude: req.body.latitude || null,
        longitude: req.body.longitude || null,
      };

      const property = await Property.create(propertyData);
      console.log("✅ Property created:", property._id);

      res.status(201).json(property);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ===== ADMIN ROUTES =====
const {
  approveProperty,
  rejectProperty,
  deleteProperty,
  featureProperty,
  verifyProperty,
} = require("../controllers/propertyController");

router.patch("/admin/feature/:id", protect, adminOnly, featureProperty);
router.patch("/admin/verify/:id", protect, adminOnly, verifyProperty);
router.patch("/approve/:id", protect, adminOnly, approveProperty);
router.patch("/reject/:id", protect, adminOnly, rejectProperty);
router.delete("/:id", protect, adminOnly, deleteProperty);

module.exports = router;