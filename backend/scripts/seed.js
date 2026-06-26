const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to database: ", MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }

  try {
    const collections = [
      "subscriptionplans",
      "restaurants",
      "users",
      "branches",
      "settings",
      "themes",
      "categories",
      "menuitems",
      "tables",
      "permissions",
      "roles"
    ];

    for (const c of collections) {
      try {
        await mongoose.connection.db.dropCollection(c);
        console.log(`Dropped collection: ${c}`);
      } catch (err) {
        // Safe to ignore if collection doesn't exist yet
      }
    }

    // 2. Create Global Subscription Plans
    const plansCollection = mongoose.connection.collection("subscriptionplans");
    const trialPlan = {
      _id: new mongoose.Types.ObjectId(),
      name: "Trial Plan",
      price: 0,
      billingCycle: "monthly",
      maxBranches: 1,
      maxTablesPerBranch: 10,
      maxMenuItems: 50,
      features: ["menu", "orders", "qr-tables"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const premiumPlan = {
      _id: new mongoose.Types.ObjectId(),
      name: "Premium Plan",
      price: 4900,
      billingCycle: "monthly",
      maxBranches: 3,
      maxTablesPerBranch: 30,
      maxMenuItems: 200,
      features: ["menu", "orders", "qr-tables", "inventory", "split-bill"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const enterprisePlan = {
      _id: new mongoose.Types.ObjectId(),
      name: "Enterprise Plan",
      price: 14900,
      billingCycle: "monthly",
      maxBranches: 10,
      maxTablesPerBranch: 100,
      maxMenuItems: 1000,
      features: ["menu", "orders", "qr-tables", "inventory", "split-bill", "white-label", "custom-domain"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await plansCollection.insertMany([trialPlan, premiumPlan, enterprisePlan]);
    console.log("Seeded Subscription Plans.");

    // 3. Create Super Admin User
    const usersCollection = mongoose.connection.collection("users");
    const superAdminPassword = await bcrypt.hash("SuperAdminPassword123!", 10);
    const superAdmin = {
      name: "System Super Admin",
      email: "superadmin@restro-saas.com",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await usersCollection.insertOne(superAdmin);
    console.log("Seeded Super Admin User.");

    // 4. Create Demo Restaurant
    const restaurantsCollection = mongoose.connection.collection("restaurants");
    const tastyBites = {
      _id: new mongoose.Types.ObjectId(),
      name: "Tasty Bites",
      slug: "tasty-bites",
      billingEmail: "admin@tastybites.com",
      phone: "+919876543210",
      address: "123 Food Street, Bangalore, India",
      isActive: true,
      isSuspended: false,
      status: "active",
      subscriptionPlan: trialPlan._id,
      subscriptionStatus: "trialing",
      subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await restaurantsCollection.insertOne(tastyBites);
    console.log("Seeded Demo Restaurant.");

    // 5. Create Demo Branch
    const branchesCollection = mongoose.connection.collection("branches");
    const mainBranch = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Tasty Bites - Main Branch",
      slug: "main",
      phone: "+919876543210",
      address: "123 Food Street, Bangalore, India",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await branchesCollection.insertOne(mainBranch);
    console.log("Seeded Demo Branch.");

    // 6. Create Restaurant Users (Admin, Chef, Waiter)
    const adminPassword = await bcrypt.hash("AdminPassword123!", 10);
    const restroAdmin = {
      name: "Tasty Bites Admin",
      email: "admin@tastybites.com",
      password: adminPassword,
      role: "RESTAURANT_ADMIN",
      restaurantId: tastyBites._id,
      branchId: mainBranch._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const chefPassword = await bcrypt.hash("ChefPassword123!", 10);
    const chef = {
      name: "Tasty Bites Chef",
      email: "chef@tastybites.com",
      password: chefPassword,
      role: "KITCHEN",
      restaurantId: tastyBites._id,
      branchId: mainBranch._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const waiterPassword = await bcrypt.hash("WaiterPassword123!", 10);
    const waiter = {
      name: "Tasty Bites Waiter",
      email: "waiter@tastybites.com",
      password: waiterPassword,
      role: "STAFF",
      restaurantId: tastyBites._id,
      branchId: mainBranch._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await usersCollection.insertMany([restroAdmin, chef, waiter]);
    console.log("Seeded Restaurant users (Admin, Chef, Waiter).");

    // 7. Seed Settings & Themes
    const settingsCollection = mongoose.connection.collection("settings");
    const themesCollection = mongoose.connection.collection("themes");
    await settingsCollection.insertOne({
      restaurantId: tastyBites._id,
      branchId: mainBranch._id,
      currency: "INR",
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      serviceChargeRate: 5,
      deliveryChargeRate: 30,
      enableSoundAlerts: true,
      thermalPrinterWidth: "80mm",
      tableCallOption: true,
      isOfflineMode: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await themesCollection.insertOne({
      restaurantId: tastyBites._id,
      primaryColor: "#ea580c",
      secondaryColor: "#1e293b",
      fontFamily: "Outfit",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("Seeded Settings & Themes.");

    // 8. Seed Categories
    const categoriesCollection = mongoose.connection.collection("categories");
    const catBurgers = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Gourmet Burgers",
      isActive: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catDrinks = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Chilled Drinks",
      isActive: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await categoriesCollection.insertMany([catBurgers, catDrinks]);
    console.log("Seeded Categories.");

    // 9. Seed Menu Items
    const menuItemsCollection = mongoose.connection.collection("menuitems");
    const burger1 = {
      restaurantId: tastyBites._id,
      categoryId: catBurgers._id,
      name: "Classic Cheese Burger",
      description: "Juicy flame-grilled chicken patty topped with melted cheddar cheese, fresh lettuce, tomatoes, and house special sauce in a toasted sesame bun.",
      price: 189,
      images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"],
      calories: 450,
      preparationTime: 12,
      ingredients: ["Chicken Patty", "Cheddar Cheese", "Sesame Bun", "Lettuce", "Tomato"],
      allergens: ["Gluten", "Dairy"],
      foodType: "non-veg",
      spicyLevel: 1,
      isRecommended: true,
      isPopular: true,
      isOutOfStock: false,
      variants: [],
      addons: [],
      branchAvailability: [mainBranch._id],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const burger2 = {
      restaurantId: tastyBites._id,
      categoryId: catBurgers._id,
      name: "Crispy Paneer Burger",
      description: "Crispy golden fried paneer patty stuffed with spices, layered with creamy mayo, onions, and crisp lettuce.",
      price: 159,
      images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60"],
      calories: 410,
      preparationTime: 10,
      ingredients: ["Paneer Patty", "Mayo", "Bun", "Onion", "Lettuce"],
      allergens: ["Gluten", "Dairy"],
      foodType: "veg",
      spicyLevel: 2,
      isRecommended: false,
      isPopular: true,
      isOutOfStock: false,
      variants: [],
      addons: [],
      branchAvailability: [mainBranch._id],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const drink1 = {
      restaurantId: tastyBites._id,
      categoryId: catDrinks._id,
      name: "Mint Mojito",
      description: "Refreshing blend of freshly squeezed lime juice, crushed mint leaves, sugar syrup, and sparkling soda served over crushed ice.",
      price: 99,
      images: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60"],
      calories: 120,
      preparationTime: 5,
      ingredients: ["Mint Leaves", "Lime", "Soda", "Sugar"],
      allergens: [],
      foodType: "veg",
      spicyLevel: 0,
      isRecommended: true,
      isPopular: false,
      isOutOfStock: false,
      variants: [],
      addons: [],
      branchAvailability: [mainBranch._id],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await menuItemsCollection.insertMany([burger1, burger2, drink1]);
    console.log("Seeded Menu Items.");

    // 10. Seed Tables & QRs
    const qrcodeLib = require("qrcode");
    const tablesCollection = mongoose.connection.collection("tables");
    const qrcodesCollection = mongoose.connection.collection("qrcodes");

    const t1Id = new mongoose.Types.ObjectId();
    const t2Id = new mongoose.Types.ObjectId();
    const t3Id = new mongoose.Types.ObjectId();

    await tablesCollection.insertMany([
      {
        _id: t1Id,
        restaurantId: tastyBites._id,
        branchId: mainBranch._id,
        tableNumber: "T1",
        seatingCapacity: 2,
        status: "available",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: t2Id,
        restaurantId: tastyBites._id,
        branchId: mainBranch._id,
        tableNumber: "T2",
        seatingCapacity: 4,
        status: "available",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: t3Id,
        restaurantId: tastyBites._id,
        branchId: mainBranch._id,
        tableNumber: "T3",
        seatingCapacity: 6,
        status: "available",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const qr1 = await qrcodeLib.toDataURL(`${appUrl}/tasty-bites/table/T1`, { width: 500, margin: 2 });
    const qr2 = await qrcodeLib.toDataURL(`${appUrl}/tasty-bites/table/T2`, { width: 500, margin: 2 });
    const qr3 = await qrcodeLib.toDataURL(`${appUrl}/tasty-bites/table/T3`, { width: 500, margin: 2 });

    await qrcodesCollection.insertMany([
      {
        restaurantId: tastyBites._id,
        branchId: mainBranch._id,
        tableId: t1Id,
        type: "table",
        qrCodeUrl: qr1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: tastyBites._id,
        branchId: mainBranch._id,
        tableId: t2Id,
        type: "table",
        qrCodeUrl: qr2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: tastyBites._id,
        branchId: mainBranch._id,
        tableId: t3Id,
        type: "table",
        qrCodeUrl: qr3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log("Seeded Branch Tables.");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding operation encountered an error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");
  }
}

seed();
