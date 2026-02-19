import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile as firebaseUpdateProfile,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

/*
  🔐 Firebase Configuration
  NOTE:
  - You can later move these to .env
  - For now this is perfectly fine for development / major project
*/
const firebaseConfig = {
  apiKey: "AIzaSyDMVNbiCLpQVUZRc1DfohtI0P6IDcKvCl4",
  authDomain: "eco-interact.firebaseapp.com",
  projectId: "eco-interact",
  storageBucket: "eco-interact.appspot.com",
  messagingSenderId: "1070121567292",
  appId: "1:1070121567292:web:5451918af4af972f8aaf39",
  measurementId: "G-23Z74PS9VL",
};

// 🚀 Initialize Firebase App (ONLY ONCE)
const app = initializeApp(firebaseConfig);

// 🔑 Firebase Services
export const auth = getAuth(app);

// ✅ ADD THIS - Set persistence to LOCAL (30 days)
// यह user को 30 days तक logged in रखेगा
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Firebase persistence set to LOCAL (30 days) - User will stay logged in');
  })
  .catch((error) => {
    console.error('❌ Firebase persistence error:', error);
  });

export const storage = getStorage(app);
export const db = getFirestore(app);

// 🌐 Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// 📤 Export Auth Functions (used in AuthContext)
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  firebaseUpdateProfile,
};