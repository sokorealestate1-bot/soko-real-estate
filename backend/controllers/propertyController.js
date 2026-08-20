const Property = require("../models/Property");
const User = require("../models/User");
const {
  sendPropertyApprovedEmail,
  sendPropertyRejectedEmail,
  sendPropertyFeaturedEmail,
  sendPropertyVerifiedEmail,
} = require("../utils/email");

// =======================
// Create Property
// =======================
const createProperty = async (req, res) => {
  try {
    console.log("🟡 Creating property for user:", req.user._id);
    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null,
    });
    console.log("🟢 Property created:", property._id);
    res.status(201).json(property);
  } catch (error) {
    console.error("🔴 Create property error:", error);
    res.status(400).json({ message: error.message });
  }
};

// =======================
// Get Approved Properties
// =======================
const getProperties = async (req, res) => {
  try {
    console.log("🟡 Fetching approved properties...");
    const properties = await Property.find({ status: "Approved" }).sort({
      isFeatured: -1,
      featuredAt: -1,
      createdAt: -1,
    });
    console.log("🟢 Found approved properties:", properties.length);
    res.json(properties);
  } catch (error) {
    console.error("🔴 Get properties error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get One Property
// =======================
const getPropertyById = async (req, res) => {
  try {
    console.log("🟡 Fetching property by ID:", req.params.id);
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error("🔴 Get property by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get Pending Properties
// =======================
const getPendingProperties = async (req, res) => {
  try {
    console.log("🟡 Fetching pending properties...");
    console.log("🟡 User making request:", req.user ? req.user._id : "No user");

    const totalCount = await Property.countDocuments();
    console.log("🟡 Total properties in DB:", totalCount);

    const properties = await Property.find({ status: "Pending" }).sort({
      createdAt: -1,
    });

    console.log("🟢 Found pending properties:", properties.length);
    res.json(properties);
  } catch (error) {
    console.error("🔴 Error in getPendingProperties:", error);
    console.error("🔴 Stack trace:", error.stack);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

// =======================
// Get My Properties
// =======================
const getMyProperties = async (req, res) => {
  try {
    console.log("🟡 Fetching properties for user:", req.user._id);
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("🟢 Found user properties:", properties.length);
    res.json(properties);
  } catch (error) {
    console.error("🔴 Get my properties error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Approve
// =======================
const approveProperty = async (req, res) => {
  try {
    console.log("🟡 Approving property:", req.params.id);
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { returnDocument: "after" } // ✅ fixed deprecation
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    try {
      const owner = await User.findById(property.owner);
      if (owner) {
        await sendPropertyApprovedEmail(owner.email, owner.name, property.title);
        console.log("📧 Approval email sent to:", owner.email);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError.message);
    }

    console.log("🟢 Property approved:", property._id);
    res.json(property);
  } catch (error) {
    console.error("🔴 Approve error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Reject
// =======================
const rejectProperty = async (req, res) => {
  try {
    console.log("🟡 Rejecting property:", req.params.id);
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { returnDocument: "after" } // ✅ fixed deprecation
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    try {
      const owner = await User.findById(property.owner);
      if (owner) {
        await sendPropertyRejectedEmail(owner.email, owner.name, property.title);
        console.log("📧 Rejection email sent to:", owner.email);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError.message);
    }

    console.log("🟢 Property rejected:", property._id);
    res.json(property);
  } catch (error) {
    console.error("🔴 Reject error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete
// =======================
const deleteProperty = async (req, res) => {
  try {
    console.log("🟡 Deleting property:", req.params.id);
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You don't have permission to delete this property.",
      });
    }

    await property.deleteOne();
    console.log("🟢 Property deleted:", req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("🔴 Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Feature Property
// =======================
const featureProperty = async (req, res) => {
  try {
    console.log("🟡 Toggling feature for property:", req.params.id);
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const isFeatured = !property.isFeatured;
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        isFeatured: isFeatured,
        featuredAt: isFeatured ? new Date() : null,
      },
      { returnDocument: "after" } // ✅ fixed deprecation
    );

    try {
      const owner = await User.findById(property.owner);
      if (owner && isFeatured) {
        await sendPropertyFeaturedEmail(owner.email, owner.name, property.title);
        console.log("📧 Feature email sent to:", owner.email);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError.message);
    }

    res.json({
      message: isFeatured ? "Property featured" : "Property unfeatured",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("🔴 Feature toggle error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Verify Property
// =======================
const verifyProperty = async (req, res) => {
  try {
    console.log("🟡 Toggling verification for property:", req.params.id);
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const isVerified = !property.isVerified;
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: isVerified,
        verifiedAt: isVerified ? new Date() : null,
      },
      { returnDocument: "after" } // ✅ fixed deprecation
    );

    try {
      const owner = await User.findById(property.owner);
      if (owner && isVerified) {
        await sendPropertyVerifiedEmail(owner.email, owner.name, property.title);
        console.log("📧 Verification email sent to:", owner.email);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError.message);
    }

    res.json({
      message: isVerified
        ? "Property verified by SOKO Real Estate"
        : "Property unverified",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("🔴 Verify toggle error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update Property
// =======================
const updateProperty = async (req, res) => {
  try {
    console.log("🟡 Updating property:", req.params.id);

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You don't have permission to edit this property.",
      });
    }

    const updates = req.body;
    const allowedUpdates = [
      "title",
      "location",
      "price",
      "category",
      "bedrooms",
      "bathrooms",
      "description",
      "ownerName",
      "ownerPhone",
      "latitude",
      "longitude",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        property[field] = updates[field];
      }
    });

    await property.save();
    console.log("🟢 Property updated:", property._id);
    res.json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("🔴 Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// EXPORTS
// =======================
module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getPendingProperties,
  getMyProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  featureProperty,
  verifyProperty,
  updateProperty,
};
