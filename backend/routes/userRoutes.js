const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Property = require("../models/Property"); // ⬅️ For analytics
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { protect, adminOnly } = require("../middleware/auth");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email");

// ===== REGISTER =====
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration request received:", req.body);

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required: name, email, password, phone",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    console.log("✅ User created:", user.email);

    await sendVerificationEmail(email, name, verificationToken);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ===== VERIFY EMAIL =====
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token.",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ===== RESEND VERIFICATION =====
router.post("/resend-verification", async (req, res) => {
  try {
    console.log("📝 Resend verification request received:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    await sendVerificationEmail(email, user.name, verificationToken);

    res.json({ message: "Verification email sent! Please check your inbox." });
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ===== LOGIN (with tracking) =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ⬇️ TRACK LOGIN
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendPasswordResetEmail(email, user.name, resetToken);

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ===== RESET PASSWORD =====
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully! You can now login." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// ADMIN ANALYTICS
// =====================================================

router.get("/analytics", protect, adminOnly, async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total properties
    const totalProperties = await Property.countDocuments();

    // Pending properties
    const pendingProperties = await Property.countDocuments({ status: "Pending" });

    // Approved properties
    const approvedProperties = await Property.countDocuments({ status: "Approved" });

    // Rejected properties
    const rejectedProperties = await Property.countDocuments({ status: "Rejected" });

    // Logged in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loggedInToday = await User.countDocuments({
      lastLogin: { $gte: today },
    });

    // Total logins (sum of loginCount)
    const result = await User.aggregate([
      { $group: { _id: null, totalLogins: { $sum: "$loginCount" } } },
    ]);
    const totalLogins = result.length > 0 ? result[0].totalLogins : 0;

    // Daily logins (last 7 days)
    const dailyLogins = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await User.countDocuments({
        lastLogin: { $gte: startOfDay, $lte: endOfDay },
      });

      dailyLogins.push({
        date: startOfDay.toISOString().split("T")[0],
        count,
      });
    }

    // Users by role
    const admins = await User.countDocuments({ role: "admin" });
    const regularUsers = totalUsers - admins;

    res.json({
      totalUsers,
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      loggedInToday,
      totalLogins,
      dailyLogins,
      admins,
      regularUsers,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// DELETE USER (Admin only)
// =====================================================

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;