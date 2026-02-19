import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../App";
import axios from "axios";
import { Crown, Sparkles, Lock, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FEATURES = [
  { icon: "🔬", title: "Ecological Simulations", desc: "Run primary & secondary succession simulations in real time" },
  { icon: "🌐", title: "Food Web Explorer", desc: "Interactive food web and chain visualizations" },
  { icon: "📊", title: "Advanced Analytics", desc: "Ecosystem data charts with predator-prey dynamics" },
  { icon: "⚡", title: "Energy Graph Mode", desc: "Detailed energy flow graph analysis" },
  { icon: "🔀", title: "Scenario Compare", desc: "Compare disturbance scenarios side-by-side" },
  { icon: "💾", title: "Export Data", desc: "Download simulation data as JSON" },
  { icon: "🧮", title: "Biomass Calculator", desc: "Full biomass and trophic efficiency calculator" },
  { icon: "🎮", title: "Simulation Control", desc: "Full ecosystem simulation control panel" },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function UpgradePage() {
  const { darkMode } = useDarkMode();
  const { currentUser, isPremium, checkPremiumStatus, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const D = darkMode;
  const pageBg = D ? "#000000" : "#f4f6f9";
  const cardBg = D ? "#0d0d0d" : "#ffffff";
  const cardBorder = D ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textMain = D ? "#f1f5f9" : "#1a202c";
  const textSub = D ? "#8b949e" : "#6b7280";
  const inputBg = D ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  // Load Razorpay script on mount
  useEffect(() => {
    loadRazorpayScript().then(loaded => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error("Failed to load Razorpay SDK");
      }
    });
  }, []);

  const getAuthHeaders = () => {
    if (!currentUser?.uid) return {};
    return { 
      "x-firebase-uid": currentUser.uid,
      "Content-Type": "application/json"
    };
  };

  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    
    setLoadingCoupon(true);
    setCouponStatus(null);
    setCouponMsg("");
    setProcessingMessage("Applying coupon...");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/apply-coupon`,
        { code: coupon.trim() },
        { 
          headers: getAuthHeaders(),
          timeout: 10000
        }
      );

      if (response.data.success) {
        setCouponStatus("success");
        setCouponMsg("🎉 Coupon applied successfully! Premium activated.");
        
        // ✅ Refresh user premium status
        await refreshUserProfile();
        await checkPremiumStatus();
        
        // ✅ Clear any cached premium checks
        localStorage.removeItem('premium_expiry_check');
        
        setProcessingMessage("Premium activated! Redirecting...");
        
        // ✅ Force full reload to ensure premium state
        setTimeout(() => {
          navigate("/dashboard");
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error("Coupon error:", err);
      setCouponStatus("error");
      setCouponMsg(err.response?.data?.message || "Invalid coupon code. Please try again.");
      setProcessingMessage("");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleRazorpay = async () => {
    setLoadingPay(true);
    setProcessingMessage("Initializing payment...");

    try {
      if (!razorpayLoaded) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setCouponStatus("error");
          setCouponMsg("Could not load payment gateway. Please refresh and try again.");
          setLoadingPay(false);
          return;
        }
      }

      setProcessingMessage("Creating payment order...");
      const orderRes = await axios.post(
        `${API_BASE_URL}/payments/create-order`,
        { amount: 19900, currency: "INR" },
        { 
          headers: getAuthHeaders(),
          timeout: 10000
        }
      );

      if (!orderRes.data.success) {
        throw new Error("Failed to create order");
      }

      const { order, key } = orderRes.data;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "EcoInteract",
        description: "Premium Membership - Lifetime Access",
        image: "https://res.cloudinary.com/demo/image/upload/ecointeract-logo.png",
        order_id: order.id,
        handler: async (response) => {
          setProcessingMessage("Verifying payment...");
          
          try {
            const verifyRes = await axios.post(
              `${API_BASE_URL}/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { 
                headers: getAuthHeaders(),
                timeout: 10000
              }
            );

            if (verifyRes.data.success) {
              setCouponStatus("success");
              setCouponMsg("🎉 Payment successful! Premium activated.");
              
              await refreshUserProfile();
              await checkPremiumStatus();
              
              setProcessingMessage("Premium activated! Redirecting...");
              
              setTimeout(() => {
                navigate("/dashboard");
                window.location.reload();
              }, 2000);
            } else {
              throw new Error("Verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setCouponStatus("error");
            setCouponMsg("Payment verification failed. Please contact support.");
            setProcessingMessage("");
            setLoadingPay(false);
          }
        },
        prefill: {
          email: currentUser?.email || "",
          name: currentUser?.displayName || currentUser?.fullName || currentUser?.name || "",
          contact: currentUser?.phone || "",
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: () => {
            setProcessingMessage("");
            setLoadingPay(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      console.error("Payment error:", err);
      setCouponStatus("error");
      setCouponMsg(err.response?.data?.message || "Could not initiate payment. Please try again.");
      setProcessingMessage("");
      setLoadingPay(false);
    }
  };

  // If already premium, show success message
  if (isPremium) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: pageBg, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        fontFamily: "Inter, sans-serif" 
      }}>
        <div style={{ 
          background: cardBg, 
          border: `1px solid ${cardBorder}`, 
          borderRadius: 24, 
          padding: 48, 
          textAlign: "center", 
          maxWidth: 420, 
          width: "100%" 
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            <Crown className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 style={{ color: "#fbbf24", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            You're Already Premium!
          </h2>
          <p style={{ color: textSub, marginBottom: 24, lineHeight: 1.6 }}>
            All features are unlocked for you. Enjoy the full EcoInteract experience.
          </p>
          <button 
            onClick={() => navigate("/dashboard")} 
            style={{ 
              background: "#16a34a", 
              color: "#fff", 
              border: "none", 
              borderRadius: 12, 
              padding: "12px 32px", 
              fontWeight: 700, 
              cursor: "pointer", 
              fontSize: 15, 
              fontFamily: "Inter, sans-serif" 
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: pageBg, 
      color: textMain, 
      fontFamily: "Inter, sans-serif" 
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
          <h1 style={{ 
            fontSize: 38, 
            fontWeight: 800, 
            marginBottom: 12, 
            background: "linear-gradient(120deg,#16a34a,#34d399)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}>
            EcoInteract Premium
          </h1>
          <p style={{ color: textSub, fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Unlock the full power of ecological simulation. Run experiments, compare scenarios, and analyze data like a researcher.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: 24, 
          marginBottom: 40 
        }}>
          
          {/* Features List */}
          <div style={{ 
            background: cardBg, 
            border: `1px solid ${cardBorder}`, 
            borderRadius: 20, 
            padding: 32 
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#16a34a" }}>
              🔓 What you unlock
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: textMain, marginBottom: 2 }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 12, color: textSub }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* Razorpay Card */}
            <div style={{ 
              background: D ? "linear-gradient(135deg,#052e16,#065f46)" : "linear-gradient(135deg,#f0fdf4,#dcfce7)", 
              border: `1px solid ${D ? "rgba(52,211,153,0.25)" : "rgba(22,163,74,0.2)"}`, 
              borderRadius: 20, 
              padding: 32, 
              textAlign: "center" 
            }}>
              <div style={{ 
                color: D ? "rgba(255,255,255,0.6)" : "#6b7280", 
                fontSize: 13, 
                marginBottom: 8, 
                textTransform: "uppercase", 
                letterSpacing: 2, 
                fontWeight: 600 
              }}>
                One-time payment • Lifetime Access
              </div>
              <div style={{ 
                color: D ? "#ffffff" : "#052e16", 
                fontSize: 56, 
                fontWeight: 800, 
                lineHeight: 1 
              }}>
                ₹199
              </div>
              <div style={{ 
                color: D ? "rgba(255,255,255,0.5)" : "#6b7280", 
                fontSize: 13, 
                marginTop: 6, 
                marginBottom: 24 
              }}>
                Lifetime access · No subscription · Never expires
              </div>
              
              {processingMessage && (
                <div style={{ 
                  marginBottom: 16, 
                  padding: "8px 12px", 
                  borderRadius: 8, 
                  fontSize: 13, 
                  background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  color: textSub 
                }}>
                  {processingMessage}
                </div>
              )}

              <button 
                onClick={handleRazorpay} 
                disabled={loadingPay} 
                style={{ 
                  width: "100%", 
                  background: loadingPay ? "rgba(22,163,74,0.5)" : "#16a34a", 
                  color: "#ffffff", 
                  border: "none", 
                  borderRadius: 12, 
                  padding: "14px 0", 
                  fontSize: 16, 
                  fontWeight: 700, 
                  cursor: loadingPay ? "not-allowed" : "pointer", 
                  transition: "all 0.2s", 
                  fontFamily: "Inter, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {loadingPay ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Pay with Razorpay
                  </>
                )}
              </button>
            </div>

            {/* Coupon Card */}
            <div style={{ 
              background: cardBg, 
              border: `1px solid ${cardBorder}`, 
              borderRadius: 20, 
              padding: 24 
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: textMain }}>
                🎟️ Have a Coupon Code?
              </h3>
              <p style={{ color: textSub, fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                Enter your coupon to activate premium instantly for free.
                <br />
                <span style={{ color: "#eab308", fontWeight: 600 }}>Try: AMANRAWAT2005</span>
              </p>
              
              <div style={{ display: "flex", gap: 8 }}>
                <input 
                  type="text" 
                  value={coupon} 
                  onChange={(e) => { 
                    setCoupon(e.target.value.toUpperCase()); 
                    setCouponStatus(null); 
                    setCouponMsg(""); 
                  }} 
                  placeholder="Enter coupon code"
                  style={{ 
                    flex: 1, 
                    background: inputBg, 
                    border: `1px solid ${couponStatus === "error" ? "#ef4444" : couponStatus === "success" ? "#16a34a" : cardBorder}`, 
                    borderRadius: 10, 
                    padding: "10px 14px", 
                    color: textMain, 
                    fontSize: 14, 
                    fontFamily: "monospace", 
                    fontWeight: 600, 
                    outline: "none", 
                    letterSpacing: 1 
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCoupon()} 
                />
                <button 
                  onClick={handleCoupon} 
                  disabled={loadingCoupon || !coupon.trim()}
                  style={{ 
                    background: coupon.trim() && !loadingCoupon ? "#16a34a" : D ? "rgba(255,255,255,0.08)" : "#e5e7eb", 
                    color: coupon.trim() && !loadingCoupon ? "#fff" : textSub, 
                    border: "none", 
                    borderRadius: 10, 
                    padding: "10px 18px", 
                    fontWeight: 700, 
                    fontSize: 14, 
                    cursor: coupon.trim() && !loadingCoupon ? "pointer" : "not-allowed", 
                    fontFamily: "Inter, sans-serif", 
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                  {loadingCoupon ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>

              {couponMsg && (
                <div style={{ 
                  marginTop: 12, 
                  padding: "10px 14px", 
                  borderRadius: 10, 
                  fontSize: 13, 
                  fontWeight: 500,
                  background: couponStatus === "success" ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)", 
                  color: couponStatus === "success" ? "#16a34a" : "#ef4444", 
                  border: `1px solid ${couponStatus === "success" ? "rgba(22,163,74,0.3)" : "rgba(239,68,68,0.3)"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  {couponStatus === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {couponMsg}
                </div>
              )}
            </div>

            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                background: "transparent", 
                border: `1px solid ${cardBorder}`, 
                borderRadius: 12, 
                padding: "12px 0", 
                color: textSub, 
                fontSize: 14, 
                cursor: "pointer", 
                fontWeight: 500, 
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              ← Go Back
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p style={{ 
          textAlign: "center", 
          color: textSub, 
          fontSize: 12, 
          lineHeight: 1.6,
          borderTop: `1px solid ${cardBorder}`,
          paddingTop: 24
        }}>
          Premium is permanent once activated · Never expires · Payments secured by Razorpay · 
          <br />
          Coupon code <span style={{ color: "#eab308", fontWeight: 600 }}>AMANRAWAT2005</span> available for instant free access
        </p>
      </div>
    </div>
  );
}