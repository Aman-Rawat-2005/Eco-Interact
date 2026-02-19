import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "../config/firebase";
import { updateProfile } from "firebase/auth";
import axios from "axios";

// Create context
export const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // ✅ Computed properties
  const isAuthenticated = !!currentUser;
  const isPremium = currentUser?.isPremium || false;

  // Check backend connection
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/health`, { 
          timeout: 3000 
        });
        if (response.status === 200) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.warn('Backend not available - running in offline mode');
        setConnectionStatus('offline');
      }
    };
    
    checkBackendConnection();
  }, []);

  // Get correct Google photo URL from providerData
  const getGooglePhotoURL = (user) => {
    if (!user) return null;
    
    if (user.providerData?.[0]?.providerId === "google.com" && user.providerData[0].photoURL) {
      const googlePhoto = user.providerData[0].photoURL;
      return googlePhoto.replace(/=s\d+-c/, "=s400-c");
    }
    
    if (user.photoURL) {
      return user.photoURL;
    }
    
    return null;
  };

  // Sync user with backend
  const syncUserWithBackend = async (user) => {
    try {
      if (connectionStatus === 'offline' || connectionStatus === 'disconnected') {
        console.log('Backend offline, skipping sync');
        return null;
      }

      const photoURL = getGooglePhotoURL(user);
      
      const response = await axios.post(`${API_BASE_URL}/auth/sync-user`, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        provider: user.providerData[0]?.providerId || "email",
        photoURL: photoURL,
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED' || !error.response) {
        console.warn('Backend connection failed - running in offline mode');
        setConnectionStatus('offline');
      } else {
        console.error("Failed to sync user with backend:", error);
      }
      return null;
    }
  };

  // Load user profile
  const loadUserProfile = async () => {
    try {
      if (!auth.currentUser) return null;
      
      if (connectionStatus === 'offline' || connectionStatus === 'disconnected') {
        const cachedProfile = localStorage.getItem("userProfile");
        return cachedProfile ? JSON.parse(cachedProfile) : null;
      }

      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          "x-firebase-uid": auth.currentUser.uid,
        },
        timeout: 5000
      });

      if (response.data.success) {
        const userData = response.data.user;
        
        if (auth.currentUser.providerData?.[0]?.providerId === "google.com") {
          const googlePhoto = getGooglePhotoURL(auth.currentUser);
          if (googlePhoto && googlePhoto !== userData.photoURL) {
            userData.photoURL = googlePhoto;
          }
        }
        
        // ✅ Save to localStorage - this persists premium status
        localStorage.setItem("userProfile", JSON.stringify(userData));
        
        // ✅ Debug log
        console.log('🟢 Premium status loaded:', {
          isPremium: userData.isPremium,
          premiumType: userData.premiumType,
        });
        
        return userData;
      }
    } catch (error) {
      console.error("Load profile error:", error);
      
      if (error.code === 'ECONNABORTED' || !error.response) {
        setConnectionStatus('offline');
        const cachedProfile = localStorage.getItem("userProfile");
        return cachedProfile ? JSON.parse(cachedProfile) : null;
      }
      
      return null;
    }
  };

  // Login with Email/Password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await syncUserWithBackend(user);
      const profile = await loadUserProfile();
      
      const userObject = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      };
      
      if (profile) {
        Object.assign(userObject, profile);
      }
      
      const correctPhoto = getGooglePhotoURL(user) || user.photoURL;
      if (correctPhoto) {
        userObject.photoURL = correctPhoto;
      }
      
      setCurrentUser(userObject);
      
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider).catch(error => {
        if (error.code === 'auth/popup-blocked' || error.message?.includes('Cross-Origin-Opener-Policy')) {
          console.warn('Popup blocked by COOP policy');
          throw new Error('Google sign-in popup was blocked. Please allow popups or try another method.');
        }
        throw error;
      });
      
      const user = result.user;
      
      const googlePhoto = getGooglePhotoURL(user);
      if (googlePhoto && googlePhoto !== user.photoURL) {
        try {
          await updateProfile(user, { photoURL: googlePhoto });
        } catch (profileError) {
          console.warn("Could not update profile:", profileError);
        }
      }
      
      await syncUserWithBackend(user);
      const profile = await loadUserProfile();
      
      const userObject = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      };
      
      if (profile) {
        Object.assign(userObject, profile);
      }
      
      const finalPhoto = googlePhoto || user.photoURL || profile?.photoURL;
      if (finalPhoto) {
        userObject.photoURL = finalPhoto;
      }
      
      setCurrentUser(userObject);
      
      return user;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Register with Email/Password
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (name) {
        await updateProfile(user, { displayName: name });
      }
      
      await syncUserWithBackend(user);
      
      await signOut(auth);
      
      return { success: true, email };
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  // Alias for register
  const signup = async (email, password, name) => {
    return register(email, password, name);
  };

  // Logout
  const logout = async () => {
    try {
      localStorage.removeItem("userProfile");
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user logged in");
      }

      const firebaseUid = auth.currentUser.uid;
      
      const firebaseUpdates = {};
      
      if (profileData.fullName && profileData.fullName !== auth.currentUser.displayName) {
        firebaseUpdates.displayName = profileData.fullName;
      }
      
      if (Object.keys(firebaseUpdates).length > 0) {
        try {
          await updateProfile(auth.currentUser, firebaseUpdates);
        } catch (fbError) {
          console.warn("Firebase profile update failed:", fbError);
        }
      }
      
      if (connectionStatus === 'offline') {
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        console.log("✅ Profile updated locally (offline mode)");
        return updatedUser;
      }
      
      console.log("Sending update to MongoDB:", profileData);
      
      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        profileData,
        {
          headers: {
            "x-firebase-uid": firebaseUid,
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));
        
        setCurrentUser(prev => {
          const updatedPrev = { ...prev };
          Object.assign(updatedPrev, updatedUser);
          return updatedPrev;
        });

        console.log("✅ Profile updated successfully in MongoDB:", updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error("Update profile error:", error);
      
      if (error.code === 'ECONNABORTED' || !error.response) {
        setConnectionStatus('offline');
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        console.log("✅ Profile updated locally (offline mode after error)");
        return updatedUser;
      }
      
      throw error;
    }
  };

  // 💎 Apply coupon
  const applyCoupon = async (code) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user logged in");
      }

      const response = await axios.post(
        `${API_BASE_URL}/payments/apply-coupon`,
        { code },
        {
          headers: {
            "x-firebase-uid": auth.currentUser.uid,
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        // Update current user with premium status
        const updatedUser = {
          ...currentUser,
          isPremium: true,
          premiumType: 'coupon',
          premiumActivatedAt: new Date().toISOString()
        };
        
        setCurrentUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));
        
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error("Apply coupon error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to apply coupon" 
      };
    }
  };

  // 💎 Create Razorpay order
  const createPremiumOrder = async (amount = 19900) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user logged in");
      }

      const response = await axios.post(
        `${API_BASE_URL}/payments/create-order`,
        { amount },
        {
          headers: {
            "x-firebase-uid": auth.currentUser.uid,
          },
          timeout: 5000
        }
      );

      return response.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  };

  // 💎 Verify payment
  const verifyPayment = async (paymentData) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user logged in");
      }

      const response = await axios.post(
        `${API_BASE_URL}/payments/verify`,
        paymentData,
        {
          headers: {
            "x-firebase-uid": auth.currentUser.uid,
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        // Update current user with premium status
        const updatedUser = {
          ...currentUser,
          isPremium: true,
          premiumType: 'premium',
          premiumActivatedAt: new Date().toISOString()
        };
        
        setCurrentUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error("Verify payment error:", error);
      throw error;
    }
  };

  // 💎 Check premium status from server
  const checkPremiumStatus = async () => {
    try {
      if (!auth.currentUser) return null;

      const response = await axios.get(
        `${API_BASE_URL}/payments/status`,
        {
          headers: {
            "x-firebase-uid": auth.currentUser.uid,
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        // Update local state if different
        if (response.data.premium !== currentUser?.isPremium) {
          const updatedUser = {
            ...currentUser,
            isPremium: response.data.premium,
            premiumType: response.data.type,
            premiumActivatedAt: response.data.activatedAt
          };
          
          setCurrentUser(updatedUser);
          localStorage.setItem("userProfile", JSON.stringify(updatedUser));
          
          console.log('🔄 Premium status updated:', {
            isPremium: response.data.premium,
            type: response.data.type
          });
        }
      }

      return response.data;
    } catch (error) {
      console.error("Check premium status error:", error);
      return null;
    }
  };

  // 💎 Refresh user profile
  const refreshUserProfile = async () => {
    try {
      if (!auth.currentUser) return null;
      
      const profile = await loadUserProfile();
      if (profile) {
        setCurrentUser(prev => ({
          ...prev,
          ...profile
        }));
      }
      return profile;
    } catch (error) {
      console.error("Refresh profile error:", error);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const correctPhoto = getGooglePhotoURL(user);
          
          await syncUserWithBackend(user);
          const profile = await loadUserProfile();
          
          const userObject = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
          };
          
          if (profile) {
            Object.assign(userObject, profile);
          }
          
          if (correctPhoto) {
            userObject.photoURL = correctPhoto;
          } else if (user.photoURL && !userObject.photoURL) {
            userObject.photoURL = user.photoURL;
          }
          
          // ✅ Debug log
          console.log('🟢 User loaded from backend:', {
            isPremium: userObject.isPremium,
            premiumType: userObject.premiumType,
            premiumActivatedAt: userObject.premiumActivatedAt,
          });
          
          setCurrentUser(userObject);
        } catch (error) {
          console.error("Auth state change error:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    register,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    loadUserProfile,
    syncUserWithBackend,
    connectionStatus,
    isOffline: connectionStatus === 'offline',
    isAuthenticated,
    isPremium,
    premiumType: currentUser?.premiumType || 'free',
    premiumActivatedAt: currentUser?.premiumActivatedAt,
    applyCoupon,
    createPremiumOrder,
    verifyPayment,
    checkPremiumStatus,
    refreshUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;