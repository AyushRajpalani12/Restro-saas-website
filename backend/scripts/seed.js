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
      features: ["menu", "orders", "qr-tables", "gst-billing"],
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
      features: ["menu", "orders", "qr-tables", "inventory", "split-bill", "gst-billing"],
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
      features: ["menu", "orders", "qr-tables", "inventory", "split-bill", "white-label", "custom-domain", "gst-billing"],
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
    const catAppetizers = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Appetizers",
      isActive: true,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catPizzas = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Wood-fired Pizzas",
      isActive: true,
      sortOrder: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catPastas = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Artisan Pastas",
      isActive: true,
      sortOrder: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catSalads = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Fresh Salads",
      isActive: true,
      sortOrder: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catSoups = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Hot Soups",
      isActive: true,
      sortOrder: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catSeafood = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Seafood",
      isActive: true,
      sortOrder: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catDesserts = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Sweet Desserts",
      isActive: true,
      sortOrder: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const catMocktails = {
      _id: new mongoose.Types.ObjectId(),
      restaurantId: tastyBites._id,
      name: "Signature Mocktails",
      isActive: true,
      sortOrder: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await categoriesCollection.insertMany([
      catBurgers, catDrinks, catAppetizers, catPizzas, catPastas,
      catSalads, catSoups, catSeafood, catDesserts, catMocktails
    ]);
    console.log("Seeded 10 Categories.");

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
    const appetizer1 = {
      restaurantId: tastyBites._id,
      categoryId: catAppetizers._id,
      name: "Cheese Garlic Breadsticks",
      description: "Baked breadsticks brushed with garlic butter and loaded with melted mozzarella cheese. Served with marinara dip.",
      price: 129,
      images: ["https://images.unsplash.com/photo-1544982503-9f984c14501a?w=500&auto=format&fit=crop&q=60"],
      calories: 320,
      preparationTime: 8,
      ingredients: ["Bread", "Garlic Butter", "Mozzarella Cheese"],
      allergens: ["Gluten", "Dairy"],
      foodType: "veg",
      spicyLevel: 0,
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
    const pizza1 = {
      restaurantId: tastyBites._id,
      categoryId: catPizzas._id,
      name: "Margherita Classic Pizza",
      description: "Traditional wood-fired Italian crust topped with rich tomato sauce, fresh buffalo mozzarella, fresh basil leaves, and olive oil.",
      price: 249,
      images: ["https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60"],
      calories: 680,
      preparationTime: 15,
      ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil"],
      allergens: ["Gluten", "Dairy"],
      foodType: "veg",
      spicyLevel: 0,
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
    const pasta1 = {
      restaurantId: tastyBites._id,
      categoryId: catPastas._id,
      name: "Creamy Alfredo Penne",
      description: "Penne pasta tossed in rich, creamy parmesan cheese sauce with fresh garlic, mushrooms, and herbs.",
      price: 219,
      images: ["https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60"],
      calories: 550,
      preparationTime: 12,
      ingredients: ["Penne Pasta", "Alfredo Sauce", "Parmesan", "Mushrooms"],
      allergens: ["Gluten", "Dairy"],
      foodType: "veg",
      spicyLevel: 0,
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
    const salad1 = {
      restaurantId: tastyBites._id,
      categoryId: catSalads._id,
      name: "Mediterranean Caesar Salad",
      description: "Romaine lettuce tossed in dressing with croutons and black olives.",
      price: 149,
      images: ["https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"],
      calories: 180,
      preparationTime: 6,
      ingredients: ["Romaine Lettuce", "Caesar Dressing", "Parmesan", "Croutons"],
      allergens: ["Gluten", "Dairy"],
      foodType: "veg",
      spicyLevel: 0,
      isRecommended: false,
      isPopular: false,
      isOutOfStock: false,
      variants: [],
      addons: [],
      branchAvailability: [mainBranch._id],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const soup1 = {
      restaurantId: tastyBites._id,
      categoryId: catSoups._id,
      name: "Roasted Tomato Basil Soup",
      description: "Smooth roasted tomato puree simmered with fresh basil leaves and cream, served with warm garlic bread.",
      price: 119,
      images: ["https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=60"],
      calories: 150,
      preparationTime: 8,
      ingredients: ["Tomato", "Basil", "Cream"],
      allergens: ["Dairy"],
      foodType: "veg",
      spicyLevel: 1,
      isRecommended: false,
      isPopular: false,
      isOutOfStock: false,
      variants: [],
      addons: [],
      branchAvailability: [mainBranch._id],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const seafood1 = {
      restaurantId: tastyBites._id,
      categoryId: catSeafood._id,
      name: "Crispy Golden Calamari",
      description: "Lightly breaded squid rings fried to golden perfection, served with garlic aioli and fresh lemon wedges.",
      price: 289,
      images: ["https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60"],
      calories: 380,
      preparationTime: 10,
      ingredients: ["Squid Rings", "Breading", "Garlic Aioli"],
      allergens: ["Gluten", "Shellfish"],
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
    const dessert1 = {
      restaurantId: tastyBites._id,
      categoryId: catDesserts._id,
      name: "Chocolate Walnut Brownie",
      description: "Warm fudge brownie loaded with walnuts and topped with rich hot chocolate fudge sauce.",
      price: 139,
      images: ["https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=60"],
      calories: 420,
      preparationTime: 7,
      ingredients: ["Chocolate", "Walnuts", "Fudge Sauce"],
      allergens: ["Gluten", "Dairy", "Nuts"],
      foodType: "veg",
      spicyLevel: 0,
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
    const mocktail1 = {
      restaurantId: tastyBites._id,
      categoryId: catMocktails._id,
      name: "Blue Lagoon Cool Cocktail",
      description: "A chilling blend of blue curacao syrup, lemon juice, club soda, and mint leaves, served over crushed ice.",
      price: 109,
      images: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60"],
      calories: 140,
      preparationTime: 5,
      ingredients: ["Blue Curacao", "Lemon", "Soda", "Mint"],
      allergens: [],
      foodType: "veg",
      spicyLevel: 0,
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

    await menuItemsCollection.insertMany([
      burger1, drink1, appetizer1, pizza1, pasta1,
      salad1, soup1, seafood1, dessert1, mocktail1
    ]);
    console.log("Seeded 10 Menu Items (1 per category).");

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
