const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  console.log("Connecting to:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  const db = mongoose.connection.db;

  const users = await db.collection("users").find({}).toArray();
  console.log("\n--- USERS ---");
  users.forEach(u => {
    console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, RestaurantId: ${u.restaurantId}`);
  });

  const restaurants = await db.collection("restaurants").find({}).toArray();
  console.log("\n--- RESTAURANTS ---");
  restaurants.forEach(r => {
    console.log(`Name: ${r.name}, ID: ${r._id}, PlanID: ${r.subscriptionPlan}, Status: ${r.status}`);
  });

  const plans = await db.collection("subscriptionplans").find({}).toArray();
  console.log("\n--- PLANS ---");
  plans.forEach(p => {
    console.log(`Name: ${p.name}, ID: ${p._id}, Features: ${JSON.stringify(p.features)}`);
  });

  await mongoose.connection.close();
}

main().catch(console.error);
