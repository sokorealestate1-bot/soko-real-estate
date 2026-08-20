const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  getPendingProperties,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  rejectProperty,
  featureProperty,
  verifyProperty,
} = require("../controllers/propertyController");
const { protect, adminOnly } = require("../middleware/auth");

// ===== PUBLIC ROUTES =====
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// ===== PROTECTED ROUTES (require login) =====
router.get("/pending", protect, getPendingProperties);
router.get("/my/properties", protect, getMyProperties);
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

// ===== ADMIN ROUTES (require admin role) =====
router.patch("/approve/:id", protect, adminOnly, approveProperty);
router.patch("/reject/:id", protect, adminOnly, rejectProperty);
router.patch("/admin/feature/:id", protect, adminOnly, featureProperty);
router.patch("/admin/verify/:id", protect, adminOnly, verifyProperty);

module.exports = router;