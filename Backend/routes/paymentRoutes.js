import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import { requireUser } from "../middleware/authMiddleware.js";
import requirePremium from "../middleware/premiumMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ COUPON CODE
const PREMIUM_COUPON = "AMANRAWAT2005";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder",
});

// ==================== CREATE ORDER ====================
router.post("/create-order", requireUser, async (req, res) => {
  try {
    const { amount = 19900, currency = "INR" } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: `premium_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Save order ID to user
    await User.findOneAndUpdate(
      { firebaseUid: req.firebaseUid },
      { razorpayOrderId: order.id }
    );

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
});

// ==================== VERIFY PAYMENT ====================
router.post("/verify", requireUser, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    // Generate signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Verify signature
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Activate premium (NO expiry - permanent)
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.firebaseUid },
      {
        isPremium: true,
        premiumType: "premium",
        premiumActivatedAt: new Date(),
        premiumExpiresAt: null, // 👈 NULL = permanent
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and premium activated",
      user: {
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumActivatedAt: user.premiumActivatedAt,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

// ==================== APPLY COUPON ====================
router.post("/apply-coupon", requireUser, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const trimmedCode = code.trim();

    // Check coupon
    if (trimmedCode !== PREMIUM_COUPON) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if already premium
    const existingUser = await User.findOne({ firebaseUid: req.firebaseUid });
    
    if (existingUser.isPremium) {
      return res.status(400).json({
        success: false,
        message: "User is already premium",
      });
    }

    // ✅ Activate premium (NO expiry - permanent)
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.firebaseUid },
      {
        isPremium: true,
        premiumType: "coupon",
        premiumActivatedAt: new Date(),
        premiumExpiresAt: null, // 👈 NULL = permanent
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "🎉 Coupon applied! Premium activated",
      user: {
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumActivatedAt: user.premiumActivatedAt,
      },
    });
  } catch (error) {
    console.error("Coupon apply error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
    });
  }
});

// ==================== CHECK PREMIUM STATUS ====================
router.get("/status", requireUser, async (req, res) => {
  try {
    const user = await User.findOne(
      { firebaseUid: req.firebaseUid },
      "isPremium premiumType premiumActivatedAt premiumExpiresAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Return as-is (no expiry check needed)
    res.status(200).json({
      success: true,
      premium: user.isPremium || false,
      type: user.premiumType || "free",
      activatedAt: user.premiumActivatedAt,
    });
  } catch (error) {
    console.error("Premium status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch premium status",
    });
  }
});

// ==================== PREMIUM PROTECTED ROUTE EXAMPLE ====================
router.get("/premium-content", requireUser, requirePremium, (req, res) => {
  res.status(200).json({
    success: true,
    message: "This is premium content",
    premiumType: req.premiumType,
  });
});

export default router;