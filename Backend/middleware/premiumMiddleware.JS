import User from "../models/User.js";

// ==================== REQUIRE PREMIUM MIDDLEWARE ====================
const requirePremium = async (req, res, next) => {
  try {
    const firebaseUid = req.firebaseUid;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Find user in database
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ ONLY check isPremium - NO expiry check
    if (!user.isPremium) {
      return res.status(403).json({
        success: false,
        message: "Premium membership required to access this resource",
        code: "PREMIUM_REQUIRED",
      });
    }

    // Attach premium info to request
    req.isPremium = true;
    req.premiumType = user.premiumType;
    
    next();
  } catch (error) {
    console.error("Premium middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default requirePremium;