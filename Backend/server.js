import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ NEW
import { errorHandler } from "./middleware/authMiddleware.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes); // ✅ NEW

// Add /api/health route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Backend is healthy and running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 EcoInteract Backend is Running!",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      payments: "/api/payments", // ✅ NEW
      health: "/api/health"
    },
  });
});

// API documentation
app.get("/api", (req, res) => {
  res.json({
    success: true,
    version: "1.0.0",
    documentation: {
      auth: {
        syncUser: "POST /api/auth/sync-user",
        getUser: "GET /api/auth/user/:uid",
        updateUser: "PUT /api/auth/user/:uid",
        deleteUser: "DELETE /api/auth/user/:uid",
        getAllUsers: "GET /api/auth/users",
      },
      users: {
        getProfile: "GET /api/users/me (header: x-firebase-uid)",
        updateProfile: "PUT /api/users/profile (header: x-firebase-uid)",
      },
      payments: { // ✅ NEW
        createOrder: "POST /api/payments/create-order (header: x-firebase-uid)",
        verifyPayment: "POST /api/payments/verify (header: x-firebase-uid)",
        applyCoupon: "POST /api/payments/apply-coupon (header: x-firebase-uid)",
        checkStatus: "GET /api/payments/status (header: x-firebase-uid)",
        premiumContent: "GET /api/payments/premium-content (header: x-firebase-uid)",
      },
      health: {
        check: "GET /api/health"
      }
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedPath: req.path,
  });
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`${"=".repeat(50)}\n`);
  console.log(`✅ Auth routes: /api/auth`);
  console.log(`✅ User routes: /api/users (UID-based auth)`);
  console.log(`✅ Payment routes: /api/payments (UID-based auth)`); // ✅ NEW
  console.log(`🔐 Auth method: x-firebase-uid header`);
  console.log(`💎 Premium middleware: /api/payments/premium-content (test route)`); // ✅ NEW
  console.log(`${"=".repeat(50)}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});