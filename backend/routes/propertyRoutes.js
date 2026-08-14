const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  getMyProperties,
  getPendingProperties,
  deleteProperty,
  updateProperty, // ⬅️ ADD THIS
} = require("../controllers/propertyController");
const { protect } = require("../middleware/auth");

// ===== PUBLIC ROUTES =====
router.get("/", getProperties);

// ===== PROTECTED ROUTES =====
router.get("/pending", protect, getPendingProperties);
router.get("/my/properties", protect, getMyProperties);

// ===== PARAMETER ROUTES =====
router.get("/:id", getPropertyById);

// ===== CREATE, UPDATE & DELETE =====
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty); // ⬅️ ADD THIS
router.delete("/:id", protect, deleteProperty);

module.exports = router;