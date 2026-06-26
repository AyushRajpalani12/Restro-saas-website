require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const dbConnect = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const superAdminRoutes = require("./routes/super-admin");
const customerRoutes = require("./routes/customer");
const uploadRoutes = require("./routes/upload");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize database connection
dbConnect();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" })); // Support base64 image uploads
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rate Limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: { error: "Too many requests, please try again later." }
});
app.use("/api/", apiLimiter);

// Bind API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/upload", uploadRoutes);

// Socket.IO Connection Handlers
io.on("connection", (socket) => {
  console.log("Realtime client connected to backend: " + socket.id);

  // Group staff, cashiers, chefs under branch channels
  socket.on("join-branch", (branchId) => {
    socket.join(branchId);
    console.log(`Socket ${socket.id} joined branch room: ${branchId}`);
  });

  // Group customers under specific tracking order channels
  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined order room: ${orderId}`);
  });

  // customer places a new order
  socket.on("new-order", (data) => {
    if (data.branchId) {
      console.log(`Order event received: Branch ${data.branchId}`);
      io.to(data.branchId).emit("order-received", data);
    }
  });

  // status updates from kitchen/cashier
  socket.on("update-order-status", (data) => {
    if (data.branchId) {
      io.to(data.branchId).emit("order-status-updated", data);
    }
    if (data.orderId) {
      io.to(data.orderId).emit("status-changed", data);
    }
  });

  // table service call triggers
  socket.on("call-waiter", (data) => {
    if (data.branchId) {
      io.to(data.branchId).emit("waiter-called", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Realtime client disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Restro SaaS API Server running on port ${PORT}`);
});
