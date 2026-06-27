const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const QRCodeGenerator = require("qrcode");

const checkAuth = require("../middleware/auth");
const checkFeature = require("../middleware/subscription");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Variant = require("../models/Variant");
const Addon = require("../models/Addon");
const Table = require("../models/Table");
const QRCode = require("../models/QRCode");
const User = require("../models/User");
const Settings = require("../models/Settings");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Restaurant = require("../models/Restaurant");

// Apply authentication middleware to all sub-routes here
router.use(checkAuth(["RESTAURANT_ADMIN", "BRANCH_MANAGER", "KITCHEN", "STAFF", "CASHIER"]));

// 1. DASHBOARD ANALYTICS
router.get("/dashboard", async (req, res) => {
  try {
    const { restaurantId } = req.user;
    if (!restaurantId) {
      return res.status(400).json({ error: "Missing restaurant bound" });
    }

    const restroObjectId = new mongoose.Types.ObjectId(restaurantId);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await Order.find({
      restaurantId: restroObjectId,
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const todayCount = todayOrders.length;
    const todayRevenue = todayOrders
      .filter(o => o.paymentStatus === "Paid" || o.status === "Completed")
      .reduce((sum, o) => sum + o.total, 0);

    const allTimeOrders = await Order.find({ restaurantId: restroObjectId });
    const totalOrders = allTimeOrders.length;
    const totalRevenue = allTimeOrders
      .filter(o => o.paymentStatus === "Paid" || o.status === "Completed")
      .reduce((sum, o) => sum + o.total, 0);

    const completedOrders = allTimeOrders.filter(o => o.status === "Completed").length;
    const cancelledOrders = allTimeOrders.filter(o => o.status === "Cancelled").length;

    // Top selling
    const topSelling = await Order.aggregate([
      { $match: { restaurantId: restroObjectId, status: "Completed" } },
      { $unwind: "$items" },
      { $lookup: {
          from: "orderitems",
          localField: "items",
          foreignField: "_id",
          as: "orderItem"
      }},
      { $unwind: "$orderItem" },
      { $group: {
          _id: "$orderItem.menuItemId",
          name: { $first: "$orderItem.name" },
          totalQty: { $sum: "$orderItem.quantity" },
          totalSales: { $sum: { $multiply: ["$orderItem.price", "$orderItem.quantity"] } }
      }},
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    // Last 6 months trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await Order.aggregate([
      { $match: {
          restaurantId: restroObjectId,
          $or: [{ paymentStatus: "Paid" }, { status: "Completed" }],
          createdAt: { $gte: sixMonthsAgo }
      }},
      { $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthlySales.map(item => {
      const monthIndex = item._id.month - 1;
      return {
        name: `${monthsName[monthIndex]} ${item._id.year}`,
        revenue: item.revenue,
        orders: item.orders
      };
    });

    return res.json({
      success: true,
      data: {
        todayCount,
        todayRevenue,
        totalOrders,
        totalRevenue,
        completedOrders,
        cancelledOrders,
        topSelling,
        chartData
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// 2. CATEGORIES
router.get("/categories", checkFeature("menu"), async (req, res) => {
  try {
    const categories = await Category.find({ restaurantId: req.user.restaurantId }).sort({ sortOrder: 1, name: 1 });
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", checkFeature("menu"), async (req, res) => {
  try {
    const { name, description, sortOrder, isActive } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const category = await Category.create({
      restaurantId: req.user.restaurantId,
      name,
      description,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    return res.json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create category" });
  }
});

router.patch("/categories", checkFeature("menu"), async (req, res) => {
  try {
    const { id, name, description, sortOrder, isActive } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (sortOrder !== undefined) updateFields.sortOrder = sortOrder;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const updated = await Category.findOneAndUpdate(
      { _id: id, restaurantId: req.user.restaurantId },
      updateFields,
      { new: true }
    );
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories", checkFeature("menu"), async (req, res) => {
  try {
    const { id } = req.query;
    await Category.findOneAndDelete({ _id: id, restaurantId: req.user.restaurantId });
    return res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete" });
  }
});

// 3. MENU ITEMS
router.get("/menu", checkFeature("menu"), async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.user.restaurantId })
      .populate("categoryId")
      .populate("variants")
      .populate("addons")
      .sort({ name: 1 });
    return res.json({ success: true, data: menuItems });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

router.post("/menu", checkFeature("menu"), async (req, res) => {
  try {
    const { restaurantId, branchId } = req.user;
    const {
      categoryId, name, description, price, images, foodType, spicyLevel,
      preparationTime, calories, isRecommended, isPopular, isOutOfStock, variants, addons
    } = req.body;

    const menuItem = await MenuItem.create({
      restaurantId,
      categoryId,
      name,
      description,
      price,
      images: images || [],
      foodType: foodType || "veg",
      spicyLevel: spicyLevel || 0,
      preparationTime,
      calories,
      isRecommended: isRecommended || false,
      isPopular: isPopular || false,
      isOutOfStock: isOutOfStock || false,
      branchAvailability: branchId ? [branchId] : [],
      isActive: true,
    });

    const variantIds = [];
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        const doc = await Variant.create({
          restaurantId, menuItemId: menuItem._id, name: v.name, price: v.price, isActive: true
        });
        variantIds.push(doc._id);
      }
    }

    const addonIds = [];
    if (addons && Array.isArray(addons)) {
      for (const a of addons) {
        const doc = await Addon.create({
          restaurantId, menuItemId: menuItem._id, name: a.name, price: a.price, isActive: true
        });
        addonIds.push(doc._id);
      }
    }

    menuItem.variants = variantIds;
    menuItem.addons = addonIds;
    await menuItem.save();

    return res.json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Create menu error:", error);
    return res.status(500).json({ error: "Failed to create menu item" });
  }
});

router.patch("/menu", checkFeature("menu"), async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const {
      id, categoryId, name, description, price, images, foodType, spicyLevel,
      preparationTime, calories, isRecommended, isPopular, isOutOfStock, isActive, variants, addons
    } = req.body;

    const updateFields = {};
    if (categoryId !== undefined) updateFields.categoryId = categoryId;
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (images !== undefined) updateFields.images = images;
    if (foodType !== undefined) updateFields.foodType = foodType;
    if (spicyLevel !== undefined) updateFields.spicyLevel = spicyLevel;
    if (preparationTime !== undefined) updateFields.preparationTime = preparationTime;
    if (calories !== undefined) updateFields.calories = calories;
    if (isRecommended !== undefined) updateFields.isRecommended = isRecommended;
    if (isPopular !== undefined) updateFields.isPopular = isPopular;
    if (isOutOfStock !== undefined) updateFields.isOutOfStock = isOutOfStock;
    if (isActive !== undefined) updateFields.isActive = isActive;

    if (variants && Array.isArray(variants)) {
      await Variant.deleteMany({ menuItemId: id, restaurantId });
      const ids = [];
      for (const v of variants) {
        const doc = await Variant.create({ restaurantId, menuItemId: id, name: v.name, price: v.price });
        ids.push(doc._id);
      }
      updateFields.variants = ids;
    }

    if (addons && Array.isArray(addons)) {
      await Addon.deleteMany({ menuItemId: id, restaurantId });
      const ids = [];
      for (const a of addons) {
        const doc = await Addon.create({ restaurantId, menuItemId: id, name: a.name, price: a.price });
        ids.push(doc._id);
      }
      updateFields.addons = ids;
    }

    const updated = await MenuItem.findOneAndUpdate(
      { _id: id, restaurantId },
      updateFields,
      { new: true }
    );
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update menu error:", error);
    return res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/menu", checkFeature("menu"), async (req, res) => {
  try {
    const { id } = req.query;
    await MenuItem.findOneAndDelete({ _id: id, restaurantId: req.user.restaurantId });
    await Variant.deleteMany({ menuItemId: id, restaurantId: req.user.restaurantId });
    await Addon.deleteMany({ menuItemId: id, restaurantId: req.user.restaurantId });
    return res.json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete" });
  }
});

// 4. TABLES & QR CODES
router.get("/tables", checkFeature("qr-tables"), async (req, res) => {
  try {
    const tables = await Table.find({ branchId: req.user.branchId }).sort({ tableNumber: 1 });
    const qrcodes = await QRCode.find({ branchId: req.user.branchId });
    const restaurant = await Restaurant.findById(req.user.restaurantId);
    return res.json({
      success: true,
      tables,
      qrcodes,
      restaurant: restaurant ? { name: restaurant.name, address: restaurant.address, phone: restaurant.phone } : null
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tables" });
  }
});

router.post("/tables", checkFeature("qr-tables"), async (req, res) => {
  try {
    const { restaurantId, branchId } = req.user;
    const { tableNumber, seatingCapacity } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const existing = await Table.findOne({ branchId, tableNumber });
    if (existing) return res.status(400).json({ error: "Table already exists" });

    const table = await Table.create({
      restaurantId, branchId, tableNumber, seatingCapacity: seatingCapacity || 2, status: "available"
    });

    // Generate QR URL based on target app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qrUrl = `${appUrl}/${restaurant.slug}/table/${tableNumber}`;

    const dataUrl = await QRCodeGenerator.toDataURL(qrUrl, {
      width: 500, margin: 2, color: { dark: "#0f172a", light: "#ffffff" }
    });

    const qrcode = await QRCode.create({
      restaurantId, branchId, tableId: table._id, type: "table", qrCodeUrl: dataUrl
    });

    return res.json({ success: true, table, qrcode });
  } catch (error) {
    console.error("Table create error:", error);
    return res.status(500).json({ error: "Failed to create table" });
  }
});

router.delete("/tables", checkFeature("qr-tables"), async (req, res) => {
  try {
    const { id } = req.query;
    await Table.findOneAndDelete({ _id: id, branchId: req.user.branchId });
    await QRCode.findOneAndDelete({ tableId: id, branchId: req.user.branchId });
    return res.json({ success: true, message: "Table and QR removed" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete table" });
  }
});

// 5. STAFF CREDENTIALS
router.get("/staff", checkFeature("staff"), async (req, res) => {
  try {
    const staff = await User.find({
      restaurantId: req.user.restaurantId,
      role: { $in: ["BRANCH_MANAGER", "KITCHEN", "STAFF", "CASHIER"] }
    }).sort({ createdAt: -1 });
    return res.json({ success: true, data: staff });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch staff" });
  }
});

router.post("/staff", checkFeature("staff"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      restaurantId: req.user.restaurantId,
      branchId: req.user.branchId,
      isActive: true,
    });
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

router.delete("/staff", checkFeature("staff"), async (req, res) => {
  try {
    const { id } = req.query;
    if (id === req.user.id) return res.status(400).json({ error: "Cannot delete yourself" });
    await User.findOneAndDelete({ _id: id, restaurantId: req.user.restaurantId });
    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete" });
  }
});

// 6. COUPONS
router.get("/coupons", checkFeature("coupons"), async (req, res) => {
  try {
    const coupons = await Coupon.find({ restaurantId: req.user.restaurantId }).sort({ endDate: -1 });
    return res.json({ success: true, data: coupons });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load coupons" });
  }
});

router.post("/coupons", checkFeature("coupons"), async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, endDate } = req.body;
    const existing = await Coupon.findOne({ restaurantId: req.user.restaurantId, code: code.toUpperCase() });
    if (existing) return res.status(400).json({ error: "Coupon already exists" });

    const coupon = await Coupon.create({
      restaurantId: req.user.restaurantId,
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      endDate: new Date(endDate),
    });
    return res.json({ success: true, data: coupon });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create coupon" });
  }
});

router.delete("/coupons", checkFeature("coupons"), async (req, res) => {
  try {
    const { id } = req.query;
    await Coupon.findOneAndDelete({ _id: id, restaurantId: req.user.restaurantId });
    return res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete" });
  }
});

// 7. BRANCH SETTINGS
router.get("/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne({ branchId: req.user.branchId });
    if (!settings) {
      settings = await Settings.create({
        restaurantId: req.user.restaurantId,
        branchId: req.user.branchId,
        currency: "INR",
        cgstRate: 2.5,
        sgstRate: 2.5,
        enableSoundAlerts: true,
      });
    }
    return res.json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load settings" });
  }
});

router.patch("/settings", async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { branchId: req.user.branchId },
      req.body,
      { new: true, upsert: true }
    );
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update settings" });
  }
});

// 8. ORDERS MANAGEMENT
router.get("/orders", checkFeature("orders"), async (req, res) => {
  try {
    const { status } = req.query;
    const query = { branchId: req.user.branchId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate({ path: "items", populate: { path: "menuItemId" } })
      .populate("tableId")
      .sort({ createdAt: -1 });

    const restaurant = await Restaurant.findById(req.user.restaurantId);
    return res.json({
      success: true,
      data: orders,
      restaurant: restaurant ? { name: restaurant.name, address: restaurant.address, phone: restaurant.phone } : null
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders", checkFeature("orders"), async (req, res) => {
  try {
    const { id, status, paymentStatus, paymentMethod } = req.body;
    const order = await Order.findOne({ _id: id, branchId: req.user.branchId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const updateFields = {};
    if (status !== undefined) {
      updateFields.status = status;
      const mapping = { "Pending": "Pending", "Preparing": "Preparing", "Ready": "Ready", "Completed": "Served", "Cancelled": "Cancelled" };
      const itemStatus = mapping[status];
      if (itemStatus) {
        await OrderItem.updateMany({ orderId: id }, { status: itemStatus });
      }
      if ((status === "Completed" || status === "Cancelled") && order.tableId) {
        await Table.findByIdAndUpdate(order.tableId, { status: "available" });
      }
      if (status === "Completed") {
        updateFields.paymentStatus = "Paid";
      }
    }
    if (paymentStatus !== undefined) updateFields.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) updateFields.paymentMethod = paymentMethod;

    const updated = await Order.findByIdAndUpdate(id, updateFields, { new: true })
      .populate({ path: "items", populate: { path: "menuItemId" } });

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update order" });
  }
});

// 8. RESTAURANT DETAILS
router.get("/restaurant-info", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.restaurantId).populate("subscriptionPlan");
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    return res.json({ success: true, data: restaurant });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch restaurant details" });
  }
});

module.exports = router;
