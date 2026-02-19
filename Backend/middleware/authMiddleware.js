import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (optional - only if you want server-side token verification)
// You'll need to download serviceAccountKey.json from Firebase Console
// Project Settings > Service Accounts > Generate New Private Key

// Uncomment this if you want to use Firebase Admin SDK
/*
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token (requires Firebase Admin SDK initialization)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Import User model
    const User = (await import('../models/User.js')).default;

    // Find user in database
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Simple middleware to validate request body
const validateUserData = (req, res, next) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({
      success: false,
      message: 'UID and email are required',
    });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  next();
};

// Middleware to log requests (useful for debugging)
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
};

// ✅ FIXED: Error handling middleware (use at the end of all routes)
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

// Middleware to check if user exists in database
const checkUserExists = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const User = (await import('../models/User.js')).default;
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request
    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Check user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ UID-BASED MIDDLEWARE - NO SERVICE ACCOUNT REQUIRED
const requireUser = (req, res, next) => {
  const firebaseUid = req.headers["x-firebase-uid"];

  if (!firebaseUid) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Firebase UID is required in x-firebase-uid header",
    });
  }

  // Basic validation - Firebase UIDs are usually 28 characters long
  if (firebaseUid.length < 20) {
    return res.status(400).json({
      success: false,
      message: "Invalid Firebase UID format",
    });
  }

  // Attach to request
  req.firebaseUid = firebaseUid;
  
  console.log(`🔐 Authenticated via UID: ${firebaseUid.substring(0, 8)}...`);
  next();
};

// ✅ FIXED: Profile image upload middleware (optional)
const validateProfileImage = (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.',
      });
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }

    next();
  } catch (error) {
    console.error('Image validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error validating image',
    });
  }
};

// ✅ Rate limiting middleware (basic implementation)
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip).filter(timestamp => now - timestamp < windowMs);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

// ✅ CORS options middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Export all middleware functions
export {
  verifyFirebaseToken,
  isAdmin,
  validateUserData,
  requestLogger,
  errorHandler,
  checkUserExists,
  requireUser,
  validateProfileImage,
  rateLimiter,
  corsOptions
};