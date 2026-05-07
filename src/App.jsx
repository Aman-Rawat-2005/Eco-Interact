import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// 🔐 Auth
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// 🌙 Dark Mode Context
export const DarkModeContext = createContext();

// ✅ useDarkMode hook
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

// 🧩 Components
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";

// 📄 Pages
import HomePage from "./pages/HomePage";
import EnergyFlowPage from "./pages/EnergyFlowPage";
import SuccessionPage from "./pages/SuccessionPage";
import VisualizationsPage from "./pages/Visualizations";
import AboutPage from "./pages/About";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import UpgradePage from "./pages/UpgradePage";
import QuizPage from "./pages/QuizPage";
import QuizHistoryPage from "./pages/QuizHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { checkPremiumStatus, isAuthenticated } = useAuth();

  // ✅ Check premium status when app loads
  useEffect(() => {
    const verifyPremium = async () => {
      if (isAuthenticated) {
        console.log('🔍 Verifying premium status on app load...');
        await checkPremiumStatus();
      }
    };
    verifyPremium();
  }, [isAuthenticated]);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: darkMode ? "#000000" : "#ffffff",
        color: darkMode ? "#f3f4f6" : "#111827",
      }}
    >
      <Header />

      <main style={{ backgroundColor: darkMode ? "#000000" : "#ffffff" }}>
        <Routes>
          {/* 🌍 PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* 🔓 PUBLIC PAGES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/energy-flow" element={<EnergyFlowPage />} />
          <Route path="/succession" element={<SuccessionPage />} />
          <Route path="/visualizations" element={<VisualizationsPage />} />

          {/* 🔒 PROTECTED ROUTES */}
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz-history" element={<ProtectedRoute><QuizHistoryPage /></ProtectedRoute>} />
          <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />

          {/* ❓ FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (darkMode) {
      html.classList.add("dark");
      body.style.backgroundColor = "#000000";
      body.style.color = "#f3f4f6";
    } else {
      html.classList.remove("dark");
      body.style.backgroundColor = "#ffffff";
      body.style.color = "#111827";
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthProvider>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Router>
          <ScrollToTop />
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? "dark" : "light"}
          />
        </Router>
      </DarkModeContext.Provider>
    </AuthProvider>
  );
}

export default App;