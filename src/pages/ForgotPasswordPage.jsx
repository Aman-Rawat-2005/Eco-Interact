import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/too-many-requests":
        return "Too many requests. Try again later";
      default:
        return "Failed to send reset email. Please try again";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Forgot Password? 🔑
          </h1>
          <p className="text-gray-600">
            Enter your email and we'll send you a password reset link
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;