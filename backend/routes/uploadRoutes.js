const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  approveProperty,
  rejectProperty,
  deleteProperty,
  featureProperty,
  verifyProperty,
  createProperty,
} = require("../controllers/propertyController");

// ===== UPLOAD PROPERTY =====
router.post(
  "/upload",
  protect,
  upload.array("images", 10), // "images" must match the frontend field name
  async (req, res) => {
    try {
      console.log("📸 Files received:", req.files ? req.files.length : 0);
      console.log("📦 Body:", req.body);

      // Ensure files exist
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      // Build image paths
      const imagePaths = req.files.map((file) => `uploads/${file.filename}`);

      // Merge with form data
      const propertyData = {
        ...req.body,
        images: imagePaths,
        owner: req.user._id,
      };

      // Create property using the controller
      const property = await createProperty(propertyData, req.user._id);

      res.status(201).json(property);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ===== ADMIN ROUTES =====
router.patch("/admin/feature/:id", protect, adminOnly, featureProperty);
router.patch("/admin/verify/:id", protect, adminOnly, verifyProperty);
router.patch("/approve/:id", protect, adminOnly, approveProperty);
router.patch("/reject/:id", protect, adminOnly, rejectProperty);
router.delete("/:id", protect, adminOnly, deleteProperty);

module.exports = router;
