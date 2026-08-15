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
  createProperty,  // ⬅️ MAKE SURE THIS IS IMPORTED
} = require("../controllers/propertyController");

// ⬅️ THIS IS THE IMPORTANT LINE — it saves the property after upload
router.post("/upload", protect, upload.array("images", 10), createProperty);

// Admin routes
router.patch("/admin/feature/:id", protect, adminOnly, featureProperty);
router.patch("/admin/verify/:id", protect, adminOnly, verifyProperty);
router.patch("/approve/:id", protect, adminOnly, approveProperty);
router.patch("/reject/:id", protect, adminOnly, rejectProperty);
router.delete("/:id", protect, adminOnly, deleteProperty);

module.exports = router;