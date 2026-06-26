const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth");
const Restaurant = require("../models/Restaurant");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const Lead = require("../models/Lead");


router.use(checkAuth(["SUPER_ADMIN"]));

// 1. RESTAURANTS
router.get("/restaurants", async (req, res) => {
  try {
    const list = await Restaurant.find({}).populate("subscriptionPlan").sort({ createdAt: -1 });
    return res.json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

router.patch("/restaurants", async (req, res) => {
  try {
    const { id, status, isActive, isSuspended, customDomain, subscriptionEndsAt } = req.body;
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (isSuspended !== undefined) updateFields.isSuspended = isSuspended;
    if (customDomain !== undefined) updateFields.customDomain = customDomain;
    if (subscriptionEndsAt !== undefined) updateFields.subscriptionEndsAt = new Date(subscriptionEndsAt);

    const updated = await Restaurant.findByIdAndUpdate(id, updateFields, { new: true }).populate("subscriptionPlan");
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update restaurant" });
  }
});

// 2. SUBSCRIPTION PLANS
router.get("/plans", async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({}).sort({ price: 1 });
    return res.json({ success: true, data: plans });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch plans" });
  }
});

router.post("/plans", async (req, res) => {
  try {
    const { name, price, billingCycle, maxBranches, maxTablesPerBranch, maxMenuItems, features, isActive } = req.body;
    const plan = await SubscriptionPlan.create({
      name, price, billingCycle, maxBranches, maxTablesPerBranch, maxMenuItems, features, isActive
    });
    return res.json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create plan" });
  }
});

router.patch("/plans", async (req, res) => {
  try {
    const { id, name, price, billingCycle, maxBranches, maxTablesPerBranch, maxMenuItems, features, isActive } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (price !== undefined) updateFields.price = price;
    if (billingCycle !== undefined) updateFields.billingCycle = billingCycle;
    if (maxBranches !== undefined) updateFields.maxBranches = maxBranches;
    if (maxTablesPerBranch !== undefined) updateFields.maxTablesPerBranch = maxTablesPerBranch;
    if (maxMenuItems !== undefined) updateFields.maxMenuItems = maxMenuItems;
    if (features !== undefined) updateFields.features = features;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const updated = await SubscriptionPlan.findByIdAndUpdate(id, updateFields, { new: true });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update plan" });
  }
});

// 3. LEADS & INQUIRIES
router.get("/leads", async (req, res) => {
  try {
    const list = await Lead.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch leads" });
  }
});

router.patch("/leads", async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: "Lead ID and status are required" });
    }
    const updated = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Lead not found" });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update lead status" });
  }
});

router.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Lead not found" });
    }
    return res.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete lead" });
  }
});

module.exports = router;

