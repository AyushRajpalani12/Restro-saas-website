const express = require("express");
const router = express.Router();

const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Theme = require("../models/Theme");
const Coupon = require("../models/Coupon");
const Table = require("../models/Table");
const Settings = require("../models/Settings");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Notification = require("../models/Notification");
const Lead = require("../models/Lead");


// 1. RESOLVE RESTAURANT SLUG & MENU
router.get("/menu", async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "Slug is required" });

    const restaurant = await Restaurant.findOne({ slug, isActive: true, isSuspended: false });
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found or inactive" });

    const theme = await Theme.findOne({ restaurantId: restaurant._id }) || {
      primaryColor: "#ea580c",
      secondaryColor: "#1e293b",
      fontFamily: "Outfit",
    };

    const categories = await Category.find({ restaurantId: restaurant._id, isActive: true }).sort({ sortOrder: 1, name: 1 });
    const menuItems = await MenuItem.find({ restaurantId: restaurant._id, isActive: true })
      .populate("variants")
      .populate("addons")
      .sort({ name: 1 });

    return res.json({ success: true, restaurant, theme, categories, menuItems });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load menu" });
  }
});

// 2. VALIDATE COUPON
router.post("/coupons/validate", async (req, res) => {
  try {
    const { restaurantId, code, subtotal } = req.body;
    if (!restaurantId || !code || subtotal === undefined) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const coupon = await Coupon.findOne({
      restaurantId,
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) return res.status(400).json({ error: "Invalid or expired coupon" });
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({ error: `Min order value required is ₹${coupon.minOrderValue}` });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
      discountAmount,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to validate coupon" });
  }
});

// 3. PLACE ORDER
router.post("/orders", async (req, res) => {
  try {
    const { restaurantId, tableNumber, customerName, customerPhone, items, couponCode, paymentMethod } = req.body;

    if (!restaurantId || !tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing order parameters" });
    }

    const table = await Table.findOne({ restaurantId, tableNumber, isActive: true });
    if (!table) return res.status(400).json({ error: `Table ${tableNumber} is not active` });

    const branchId = table.branchId;
    const settings = await Settings.findOne({ branchId });
    const cgstRate = settings?.cgstRate || 0;
    const sgstRate = settings?.sgstRate || 0;
    const serviceChargeRate = settings?.serviceChargeRate || 0;

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        restaurantId,
        code: couponCode.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });
      if (coupon && subtotal >= coupon.minOrderValue) {
        discount = coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const cgst = 0; // Removed GST tax for now
    const sgst = 0; // Removed GST tax for now
    const serviceCharge = (taxableAmount * serviceChargeRate) / 100;
    const total = taxableAmount + cgst + sgst + serviceCharge;

    const order = new Order({
      restaurantId,
      branchId,
      tableId: table._id,
      customerName,
      customerPhone,
      type: "dine-in",
      status: "Pending",
      subtotal,
      cgst,
      sgst,
      igst: 0,
      serviceCharge,
      deliveryCharge: 0,
      discount,
      total,
      couponCode,
      paymentStatus: "Pending",
      paymentMethod: paymentMethod || "Cash",
      items: [],
    });

    const savedOrder = await order.save();

    const orderItemIds = [];
    for (const item of items) {
      const doc = await OrderItem.create({
        orderId: savedOrder._id,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        selectedAddons: item.selectedAddons,
        specialInstructions: item.specialInstructions,
        status: "Pending",
      });
      orderItemIds.push(doc._id);
    }

    savedOrder.items = orderItemIds;
    await savedOrder.save();

    table.status = "occupied";
    await table.save();

    await Notification.create({
      restaurantId,
      branchId,
      title: "New Order Placed",
      message: `Table ${tableNumber} has placed a new order for ${items.length} items (Total: ₹${total.toFixed(2)})`,
      type: "new_order",
    });

    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id,
      total: savedOrder.total,
      branchId: branchId.toString(),
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({ error: "Failed to place order" });
  }
});

// 4. ORDER DETAILS (TRACKING)
router.get("/orders/track", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Order ID is required" });

    const order = await Order.findById(id).populate({
      path: "items",
      populate: { path: "menuItemId" },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

// 5. SUBMIT LEAD INQUIRY
router.post("/leads", async (req, res) => {
  try {
    const { restaurantName, ownerName, email, phone, message } = req.body;
    if (!restaurantName || !ownerName || !email || !phone) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }

    const lead = await Lead.create({
      restaurantName,
      ownerName,
      email,
      phone,
      message,
    });

    return res.json({
      success: true,
      message: "Your inquiry has been submitted successfully! Our team will contact you shortly.",
      data: lead,
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

module.exports = router;

