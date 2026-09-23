const mongoose = require("mongoose");
const dns = require("dns");

// Only set custom DNS fallback in local environment if needed, avoid overriding Cloud DNS on Render/Vercel
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (err) {
    // Ignore DNS set errors
  }
}

const dbConnect = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Error: Please define MONGODB_URI in your environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.error("Database connection failure:", error);
    process.exit(1);
  }
};

module.exports = dbConnect;
