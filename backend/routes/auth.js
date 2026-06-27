const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Branch = require("../models/Branch");
const Settings = require("../models/Settings");
const Theme = require("../models/Theme");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const { sendOtpEmail } = require("../services/email");

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// 1. REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { restaurantName, email, password, phone, address, subscriptionPlanId } = req.body;

    if (!restaurantName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    let defaultPlan = await SubscriptionPlan.findOne({ name: "Trial Plan" });
    if (!defaultPlan) {
      defaultPlan = await SubscriptionPlan.create({
        name: "Trial Plan",
        price: 0,
        billingCycle: "monthly",
        maxBranches: 1,
        maxTablesPerBranch: 10,
        maxMenuItems: 50,
        features: ["menu", "orders", "qr-tables"],
        isActive: true,
      });
    }

    let selectedPlan = defaultPlan;
    let selectedStatus = "trialing";
    let selectedEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    if (subscriptionPlanId) {
      const planExists = await SubscriptionPlan.findById(subscriptionPlanId);
      if (planExists) {
        selectedPlan = planExists;
        selectedStatus = planExists.price > 0 ? "active" : "trialing";
        selectedEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    }

    let slug = generateSlug(restaurantName);
    let slugConflict = await Restaurant.findOne({ slug });
    let counter = 1;
    while (slugConflict) {
      slug = `${generateSlug(restaurantName)}-${counter}`;
      slugConflict = await Restaurant.findOne({ slug });
      counter++;
    }

    const restaurant = await Restaurant.create({
      name: restaurantName,
      slug,
      billingEmail: email.toLowerCase(),
      phone,
      address,
      subscriptionPlan: selectedPlan._id,
      subscriptionStatus: selectedStatus,
      subscriptionEndsAt: selectedEndsAt,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const branch = await Branch.create({
      restaurantId: restaurant._id,
      name: `${restaurantName} - Main Branch`,
      slug: "main",
      phone,
      address,
      isActive: true,
    });

    const user = await User.create({
      name: restaurantName + " Admin",
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "RESTAURANT_ADMIN",
      restaurantId: restaurant._id,
      branchId: branch._id,
      isActive: true,
    });

    await Settings.create({
      restaurantId: restaurant._id,
      branchId: branch._id,
      currency: "INR",
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      serviceChargeRate: 0,
      deliveryChargeRate: 0,
      enableSoundAlerts: true,
      thermalPrinterWidth: "80mm",
      tableCallOption: true,
      isOfflineMode: false,
    });

    await Theme.create({
      restaurantId: restaurant._id,
      primaryColor: "#ea580c",
      secondaryColor: "#1e293b",
      fontFamily: "Outfit",
    });

    return res.json({
      success: true,
      message: "Restaurant and Admin registered successfully",
      slug: restaurant.slug,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: error.message || "Failed to register" });
  }
});

// 2. LOGIN (Signs and returns JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ error: "No user found with this email" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "User account is deactivated" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Sign JWT Token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId ? user.restaurantId.toString() : null,
        branchId: user.branchId ? user.branchId.toString() : null,
      },
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret",
      { expiresIn: "30d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId ? user.restaurantId.toString() : null,
        branchId: user.branchId ? user.branchId.toString() : null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
});

// 3. FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "No user found with this email address" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    await sendOtpEmail(user.email, user.name, otpCode);

    return res.json({
      success: true,
      message: "Password reset OTP has been sent successfully to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
});

// 4. RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.otpCode || user.otpCode !== otpCode) {
      return res.status(400).json({ error: "Invalid OTP code" });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP code has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful, you can now log in with your new password",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

module.exports = router;
