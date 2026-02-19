import User from "../models/User.js";

// 🎯 Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUid;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    const profile = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      fullName: user.fullName || user.name || "",
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth || null,
      country: user.country || "",
      photoURL: user.photoURL || user.profilePicture || null,
      profileCompleted: user.profileCompleted || false,
      role: user.role || "student",
      authProvider: user.authProvider || "email",
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 📝 Update user profile - FIXED for base64 images
export const updateUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUid;
    const {
      firstName,
      lastName,
      fullName,
      phone,
      gender,
      dateOfBirth,
      country,
      photoURL,
      profileCompleted
    } = req.body;

    console.log("Updating profile for UID:", firebaseUid);
    console.log("PhotoURL length:", photoURL?.length || 0);

    // Find user
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    let updated = false;

    if (firstName !== undefined) {
      user.firstName = firstName;
      updated = true;
    }
    
    if (lastName !== undefined) {
      user.lastName = lastName;
      updated = true;
    }
    
    // Auto-compute fullName
    if (firstName !== undefined || lastName !== undefined) {
      const newFirstName = firstName !== undefined ? firstName : user.firstName;
      const newLastName = lastName !== undefined ? lastName : user.lastName;
      user.fullName = [newFirstName, newLastName].filter(Boolean).join(" ");
      user.name = user.fullName;
      updated = true;
    } else if (fullName !== undefined) {
      user.fullName = fullName;
      user.name = fullName;
      updated = true;
    }

    if (phone !== undefined) {
      user.phone = phone;
      updated = true;
    }
    
    if (gender !== undefined) {
      user.gender = gender;
      updated = true;
    }
    
    if (dateOfBirth !== undefined) {
      user.dateOfBirth = dateOfBirth;
      updated = true;
    }
    
    if (country !== undefined) {
      user.country = country;
      updated = true;
    }
    
    // ✅ Save photoURL (base64 string)
    if (photoURL !== undefined && photoURL !== null && photoURL !== '') {
      user.photoURL = photoURL;
      user.profilePicture = photoURL; // Backward compatibility
      updated = true;
      console.log("PhotoURL updated");
    }

    // Mark profile as completed
    if (user.firstName && user.lastName) {
      user.profileCompleted = true;
      updated = true;
    } else if (profileCompleted !== undefined) {
      user.profileCompleted = profileCompleted;
      updated = true;
    }

    if (updated) {
      user.updatedAt = Date.now();
      await user.save();
      console.log("User updated successfully:", user.email);
    }

    const updatedProfile = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      photoURL: user.photoURL || user.profilePicture,
      profileCompleted: user.profileCompleted,
      role: user.role,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};