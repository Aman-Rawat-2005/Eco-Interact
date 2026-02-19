import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle Email/Password Registration
  const handleEmailSignup = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      // Register user (this will create account and log out automatically)
      const result = await register(email, password, name);
      
      if (result.success) {
        // Show success message
        setSuccessMessage(`Account created successfully! Please login with your email: ${email}`);
        
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        
        // Show success message for 3 seconds then redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Signup (इसमें automatic login होगा)
  const handleGoogleSignup = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Get user-friendly error messages
  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters";
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      default:
        return "Failed to create account. Please try again";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account 🌱
          </h1>
          <p className="text-gray-600">Join EcoInteract and start learning!</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
            <p className="text-sm mt-2 text-green-600">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && !successMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Registration Form - Only show if no success message */}
        {!successMessage && (
          <>
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>
          </>
        )}

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;