import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔐 Firebase Identity
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 📧 Auth Basics
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    authProvider: {
      type: String,
      enum: ["email", "google.com", "password"],
      required: true,
    },

    // 👤 Profile Identity
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    name: {
      // backward compatibility
      type: String,
      trim: true,
    },

    // 📱 Contact Info
    phone: {
      type: String,
      trim: true,
    },

    // 🧬 Personal Info
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say", ""],
      default: "",
    },

    dateOfBirth: {
      type: Date,
    },

    country: {
      type: String,
      trim: true,
    },

    // 🖼️ Profile Image
    photoURL: {
      type: String,
      trim: true,
    },

    profilePicture: {
      // backward compatibility
      type: String,
      default: null,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // 🧑‍🎓 Role & Status
    role: {
      type: String,
      enum: ["student", "user", "admin"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ⏱️ Activity Tracking
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // ========== 💎 PREMIUM FIELDS ==========
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumType: {
      type: String,
      enum: ["free", "premium", "coupon"],
      default: "free",
    },
    premiumActivatedAt: {
      type: Date,
      default: null,
    },
    // ✅ Optional - can be null for lifetime premium
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 🔎 Indexes
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ isPremium: 1 });

// 🔁 Instance Method
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = Date.now();
  return this.save();
};

const User = mongoose.model("User", userSchema);
export default User;