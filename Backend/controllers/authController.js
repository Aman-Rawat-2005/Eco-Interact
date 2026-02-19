import User from "../models/User.js";

// 🔐 Sync User - Create or Update User in MongoDB
export const syncUser = async (req, res) => {
  try {
    const { uid, email, name, provider, photoURL } = req.body;

    // Validation
    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: "UID and email are required",
      });
    }

    console.log("🟢 Sync user request:", { uid, email, provider, hasPhoto: !!photoURL });

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // Update basic info
      if (name) user.name = name;
      user.email = email; // Always update email
      
      // Only update photoURL if a new valid URL is provided
      if (photoURL && photoURL !== "null" && photoURL !== "undefined") {
        // Only update if different from current
        if (user.photoURL !== photoURL) {
          console.log("🟢 Updating photoURL:", {
            old: user.photoURL,
            new: photoURL
          });
          user.photoURL = photoURL;
        }
      }
      
      // Update auth provider if provided
      if (provider) user.authProvider = provider;
      
      // Update last login
      user.lastLogin = Date.now();
      
      await user.save();

      return res.status(200).json({
        success: true,
        message: "User synced successfully",
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          name: user.name,
          email: user.email,
          role: user.role,
          photoURL: user.photoURL,
          profilePicture: user.profilePicture,
          // ✅ NEW PREMIUM FIELDS ADDED
          isPremium: user.isPremium,
          premiumType: user.premiumType,
          premiumActivatedAt: user.premiumActivatedAt,
          premiumExpiresAt: user.premiumExpiresAt,
        },
      });
    }

    // Create new user
    const newPhotoURL = photoURL && photoURL !== "null" && photoURL !== "undefined" 
      ? photoURL 
      : null;

    user = await User.create({
      firebaseUid: uid,
      email,
      name: name || email.split("@")[0],
      fullName: name || email.split("@")[0],
      authProvider: provider || "email",
      photoURL: newPhotoURL,
      profilePicture: newPhotoURL, // For backward compatibility
      lastLogin: Date.now(),
      // ✅ NEW PREMIUM FIELDS (default values, so optional)
      isPremium: false,
      premiumType: "free",
    });

    console.log("✅ New user created with photo:", newPhotoURL);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
        profilePicture: user.profilePicture,
        // ✅ NEW PREMIUM FIELDS ADDED
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumActivatedAt: user.premiumActivatedAt,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (error) {
    console.error("Sync User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 👤 Get Current User Profile (by header UID)
export const getCurrentUser = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUid;

    const user = await User.findOne({ firebaseUid }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        photoURL: user.photoURL,
        profilePicture: user.profilePicture,
        role: user.role,
        profileCompleted: user.profileCompleted,
        // ✅ NEW PREMIUM FIELDS ADDED
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumActivatedAt: user.premiumActivatedAt,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 👤 Get User Profile by UID param
export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ firebaseUid: uid }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        photoURL: user.photoURL,
        profilePicture: user.profilePicture,
        role: user.role,
        profileCompleted: user.profileCompleted,
        // ✅ NEW PREMIUM FIELDS ADDED
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumActivatedAt: user.premiumActivatedAt,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 📝 Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUid;
    const { firstName, lastName, phone, gender, dateOfBirth, country, photoURL, fullName } = req.body;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields only if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (country !== undefined) user.country = country;
    if (fullName !== undefined) user.fullName = fullName;
    
    // Only update photoURL if a valid URL is provided
    if (photoURL && photoURL !== "null" && photoURL !== "undefined") {
      console.log("🟢 Updating profile photo:", {
        old: user.photoURL,
        new: photoURL
      });
      user.photoURL = photoURL;
      user.profilePicture = photoURL; // For backward compatibility
    }

    // Auto-generate fullName from firstName + lastName if not provided
    if (!fullName && (firstName || lastName)) {
      user.fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }

    // Check if profile is complete
    if (user.firstName && user.lastName && user.country) {
      user.profileCompleted = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        photoURL: user.photoURL,
        profilePicture: user.profilePicture,
        profileCompleted: user.profileCompleted,
        // ✅ NEW PREMIUM FIELDS ADDED
        isPremium: user.isPremium,
        premiumType: user.premiumType,
        premiumActivatedAt: user.premiumActivatedAt,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🗑️ Delete User Account
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOneAndDelete({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 📊 Get All Users (Admin Only - Future Feature)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium, // ✅ NEW
        premiumType: user.premiumType, // ✅ NEW
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      })),
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};