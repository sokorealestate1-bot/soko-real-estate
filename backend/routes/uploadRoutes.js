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

// ===== UPLOAD PROPERTY (with images) =====
router.post(
  "/upload",
  protect,
  upload.array("images", 10), // "images" must match the field name in frontend
  async (req, res) => {
    try {
      // Multer adds the files to req.files
      // The body fields are in req.body
      console.log("📸 Files received:", req.files.length);
      console.log("📦 Body:", req.body);

      // Build image paths
      const imagePaths = req.files.map((file) => `uploads/${file.filename}`);

      // Merge with existing form data
      const propertyData = {
        ...req.body,
        images: imagePaths,
        owner: req.user._id,
      };

      // Create property using the controller
      const property = await require("../controllers/propertyController").createPropertyDirect(
        propertyData
      );

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
