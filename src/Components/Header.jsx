// Components/Header.js

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // ✅ Import useTranslation
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../App";
import {
  Menu,
  X,
  Search,
  User,
  Settings,
  LogOut,
  Home,
  BarChart3,
  Leaf,
  Zap,
  Info,
  Brain,
  UserCircle,
  LayoutDashboard,
  CheckCircle,
  Moon,
  Sun,
  History,
  ArrowRight,
  FileText,
  BookOpen,
  FlaskConical,
  ChevronRight,
  Layers,
  LogIn,
  UserPlus,
  Star,
  Sprout,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   GLOBAL SEARCH CONTENT INDEX - WITH i18n KEYS
═══════════════════════════════════════════════════════ */
const SEARCH_INDEX = [
  {
    id: "home-hero",
    titleKey: "search.home.title",
    descriptionKey: "search.home.description",
    path: "/",
    categoryKey: "search.categories.page",
    icon: "home",
    keywords: ["home", "welcome", "ecology", "interactive", "ecointeract", "start"],
  },
  {
    id: "energy-intro",
    titleKey: "search.energy.intro.title",
    descriptionKey: "search.energy.intro.description",
    path: "/energy-flow",
    categoryKey: "search.categories.energyFlow",
    icon: "zap",
    keywords: ["energy", "flow", "sun", "sunlight", "producer", "photosynthesis", "trophic"],
  },
  {
    id: "energy-trophic",
    titleKey: "search.energy.trophic.title",
    descriptionKey: "search.energy.trophic.description",
    path: "/energy-flow",
    categoryKey: "search.categories.energyFlow",
    icon: "zap",
    keywords: ["trophic", "level", "herbivore", "carnivore", "apex", "predator", "food chain"],
  },
  {
    id: "energy-10percent",
    titleKey: "search.energy.tenPercent.title",
    descriptionKey: "search.energy.tenPercent.description",
    path: "/energy-flow",
    categoryKey: "search.categories.energyFlow",
    icon: "zap",
    keywords: ["10%", "ten percent", "energy rule", "heat", "loss", "transfer", "efficiency"],
  },
  {
    id: "energy-pyramid",
    titleKey: "search.energy.pyramid.title",
    descriptionKey: "search.energy.pyramid.description",
    path: "/energy-flow",
    categoryKey: "search.categories.energyFlow",
    icon: "zap",
    keywords: ["pyramid", "biomass", "number", "energy pyramid", "ecological"],
  },
  {
    id: "succession-intro",
    titleKey: "search.succession.intro.title",
    descriptionKey: "search.succession.intro.description",
    path: "/succession",
    categoryKey: "search.categories.succession",
    icon: "leaf",
    keywords: ["succession", "ecosystem", "change", "time", "climax", "community", "bare rock"],
  },
  {
    id: "succession-primary",
    titleKey: "search.succession.primary.title",
    descriptionKey: "search.succession.primary.description",
    path: "/succession",
    categoryKey: "search.categories.succession",
    icon: "leaf",
    keywords: ["primary succession", "bare rock", "lichen", "pioneer", "no soil", "volcanic"],
  },
  {
    id: "succession-secondary",
    titleKey: "search.succession.secondary.title",
    descriptionKey: "search.succession.secondary.description",
    path: "/succession",
    categoryKey: "search.categories.succession",
    icon: "leaf",
    keywords: ["secondary succession", "disturbance", "fire", "flood", "soil", "recovery", "regrowth"],
  },
  {
    id: "succession-pioneer",
    titleKey: "search.succession.pioneer.title",
    descriptionKey: "search.succession.pioneer.description",
    path: "/succession",
    categoryKey: "search.categories.succession",
    icon: "leaf",
    keywords: ["pioneer", "species", "colonize", "first", "lichen", "moss", "habitat"],
  },
  {
    id: "succession-climax",
    titleKey: "search.succession.climax.title",
    descriptionKey: "search.succession.climax.description",
    path: "/succession",
    categoryKey: "search.categories.succession",
    icon: "leaf",
    keywords: ["climax", "community", "stable", "final", "equilibrium", "old growth", "forest"],
  },
  {
    id: "viz-foodweb",
    titleKey: "search.viz.foodweb.title",
    descriptionKey: "search.viz.foodweb.description",
    path: "/visualizations",
    categoryKey: "search.categories.visualizations",
    icon: "chart",
    keywords: ["food web", "visualization", "interactive", "species", "network", "predator", "prey"],
  },
  {
    id: "viz-nutrient",
    titleKey: "search.viz.nutrient.title",
    descriptionKey: "search.viz.nutrient.description",
    path: "/visualizations",
    categoryKey: "search.categories.visualizations",
    icon: "chart",
    keywords: ["nutrient", "cycle", "carbon", "nitrogen", "water", "biogeochemical"],
  },
  {
    id: "viz-biomes",
    titleKey: "search.viz.biomes.title",
    descriptionKey: "search.viz.biomes.description",
    path: "/visualizations",
    categoryKey: "search.categories.visualizations",
    icon: "chart",
    keywords: ["biome", "desert", "rainforest", "tundra", "coral reef", "grassland", "explorer"],
  },
  {
    id: "viz-population",
    titleKey: "search.viz.population.title",
    descriptionKey: "search.viz.population.description",
    path: "/visualizations",
    categoryKey: "search.categories.visualizations",
    icon: "chart",
    keywords: ["population", "dynamics", "predator", "prey", "oscillation", "lotka", "volterra"],
  },
  {
    id: "quiz-main",
    titleKey: "search.quiz.main.title",
    descriptionKey: "search.quiz.main.description",
    path: "/quiz",
    categoryKey: "search.categories.quiz",
    icon: "brain",
    keywords: ["quiz", "test", "knowledge", "questions", "answers", "exam", "practice"],
  },
  {
    id: "quiz-history",
    titleKey: "search.quiz.history.title",
    descriptionKey: "search.quiz.history.description",
    path: "/quiz-history",
    categoryKey: "search.categories.quiz",
    icon: "brain",
    keywords: ["quiz history", "past attempts", "scores", "performance", "results", "attempts"],
  },
  {
    id: "about-overview",
    titleKey: "search.about.overview.title",
    descriptionKey: "search.about.overview.description",
    path: "/about",
    categoryKey: "search.categories.about",
    icon: "info",
    keywords: ["about", "project", "synopsis", "objective", "methodology", "team", "ecointeract"],
  },
  {
    id: "about-developer",
    titleKey: "search.about.developer.title",
    descriptionKey: "search.about.developer.description",
    path: "/about",
    categoryKey: "search.categories.about",
    icon: "info",
    keywords: ["developer", "aman rawat", "designer", "tias", "creator", "built by"],
  },
  {
    id: "about-vision",
    titleKey: "search.about.vision.title",
    descriptionKey: "search.about.vision.description",
    path: "/about",
    categoryKey: "search.categories.about",
    icon: "info",
    keywords: ["future", "vision", "ai", "simulation", "analytics", "roadmap", "upcoming"],
  },
  {
    id: "dashboard",
    titleKey: "search.dashboard.title",
    descriptionKey: "search.dashboard.description",
    path: "/dashboard",
    categoryKey: "search.categories.account",
    icon: "dashboard",
    keywords: ["dashboard", "progress", "activity", "stats", "learning", "overview"],
  },
  {
    id: "profile",
    titleKey: "search.profile.title",
    descriptionKey: "search.profile.description",
    path: "/profile",
    categoryKey: "search.categories.account",
    icon: "user",
    keywords: ["profile", "account", "avatar", "name", "email", "personal", "details"],
  },
  {
    id: "settings",
    titleKey: "search.settings.title",
    descriptionKey: "search.settings.description",
    path: "/settings",
    categoryKey: "search.categories.account",
    icon: "settings",
    keywords: ["settings", "preferences", "dark mode", "notifications", "customize"],
  },
  {
    id: "concept-biodiversity",
    titleKey: "search.concepts.biodiversity.title",
    descriptionKey: "search.concepts.biodiversity.description",
    path: "/visualizations",
    categoryKey: "search.categories.concept",
    icon: "flask",
    keywords: ["biodiversity", "species richness", "diversity", "habitat", "extinction"],
  },
  {
    id: "concept-decomposer",
    titleKey: "search.concepts.decomposer.title",
    descriptionKey: "search.concepts.decomposer.description",
    path: "/energy-flow",
    categoryKey: "search.categories.concept",
    icon: "flask",
    keywords: ["decomposer", "detritivore", "fungi", "bacteria", "decay", "decompose", "recycle"],
  },
  {
    id: "concept-keystone",
    titleKey: "search.concepts.keystone.title",
    descriptionKey: "search.concepts.keystone.description",
    path: "/visualizations",
    categoryKey: "search.categories.concept",
    icon: "flask",
    keywords: ["keystone", "species", "ecosystem", "impact", "sea otter", "wolf"],
  },
  {
    id: "concept-carrying",
    titleKey: "search.concepts.carrying.title",
    descriptionKey: "search.concepts.carrying.description",
    path: "/succession",
    categoryKey: "search.categories.concept",
    icon: "flask",
    keywords: ["carrying capacity", "population", "limit", "sustainable", "environment", "maximum"],
  },
];

/* ── Icon map ── */
const iconMap = {
  home: <Home className="w-3.5 h-3.5" />,
  zap: <Zap className="w-3.5 h-3.5" />,
  leaf: <Leaf className="w-3.5 h-3.5" />,
  chart: <BarChart3 className="w-3.5 h-3.5" />,
  brain: <Brain className="w-3.5 h-3.5" />,
  info: <Info className="w-3.5 h-3.5" />,
  dashboard: <LayoutDashboard className="w-3.5 h-3.5" />,
  user: <User className="w-3.5 h-3.5" />,
  settings: <Settings className="w-3.5 h-3.5" />,
  flask: <FlaskConical className="w-3.5 h-3.5" />,
};

const categoryColor = (cat, darkMode) => {
  const map = {
    Page: darkMode ? "#60a5fa" : "#2563eb",
    "Energy Flow": darkMode ? "#fb923c" : "#ea580c",
    Succession: darkMode ? "#34d399" : "#16a34a",
    Visualizations: darkMode ? "#a78bfa" : "#7c3aed",
    Quiz: darkMode ? "#f472b6" : "#db2777",
    About: darkMode ? "#94a3b8" : "#475569",
    Account: darkMode ? "#fbbf24" : "#d97706",
    Concept: darkMode ? "#67e8f9" : "#0891b2",
  };
  return map[cat] || (darkMode ? "#94a3b8" : "#64748b");
};

/* ── Fuzzy search function - Now uses t() for scoring ── */
const searchContent = (query, t) => {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase().trim();
  
  const scored = SEARCH_INDEX.map((item) => {
    const titleTranslated = t(item.titleKey).toLowerCase();
    const descTranslated = t(item.descriptionKey).toLowerCase();
    
    let score = 0;
    
    if (titleTranslated === q) score += 100;
    else if (titleTranslated.startsWith(q)) score += 60;
    else if (titleTranslated.includes(q)) score += 40;
    
    if (descTranslated.includes(q)) score += 20;
    
    item.keywords.forEach((kw) => {
      if (kw === q) score += 50;
      else if (kw.startsWith(q)) score += 30;
      else if (kw.includes(q)) score += 10;
    });
    
    return { ...item, score };
  });

  return scored
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

/* ═══════════════════════════════════════════════════════
   GLOBAL SEARCH BAR COMPONENT - WITH i18n
═══════════════════════════════════════════════════════ */
const GlobalSearchBar = ({ isMobile = false, onClose }) => {
  const { t, i18n } = useTranslation(); // ✅ Get translation function
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  /* Real-time search - Pass t to searchContent */
  useEffect(() => {
    const res = searchContent(query, t);
    setResults(res);
    setIsOpen(query.trim().length >= 1);
    setActiveIndex(-1);
  }, [query, t, i18n.language]); // ✅ Add i18n.language dependency

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Keyboard nav */
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery("");
    navigate(item.path);
    if (onClose) onClose();
    inputRef.current?.blur();
  };

  /* Group results by category - using translated categories */
  const grouped = results.reduce((acc, item) => {
    const translatedCat = t(item.categoryKey);
    if (!acc[translatedCat]) acc[translatedCat] = [];
    acc[translatedCat].push(item);
    return acc;
  }, {});

  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const dropBg = darkMode ? "#111111" : "#ffffff";
  const dropBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const textMain = darkMode ? "#f1f5f9" : "#0f172a";
  const textSub = darkMode ? "#64748b" : "#64748b";

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Input */}
      <div
        className="flex items-center gap-2 rounded-full px-3 py-2"
        style={{
          backgroundColor: inputBg,
          border: `1px solid ${inputBorder}`,
          width: isMobile ? "100%" : "220px",
          transition: "width 0.2s ease",
        }}
      >
        <Search className="shrink-0" size={14} style={{ color: textSub }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={t('search.placeholder')}
          className="bg-transparent outline-none text-sm w-full"
          style={{ 
            color: textMain,
            caretColor: darkMode ? "#34d399" : "#16a34a" 
          }}
          aria-label={t('search.label')}
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: textSub }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-[9999]"
          style={{
            backgroundColor: dropBg,
            border: `1px solid ${dropBorder}`,
            boxShadow: darkMode
              ? "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            minWidth: "300px",
            maxHeight: "420px",
            overflowY: "auto",
          }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center" style={{ color: textSub }}>
              <Search size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t('search.noResults', { query })}</p>
              <p className="text-xs mt-1 opacity-60">{t('search.tryDifferent')}</p>
            </div>
          ) : (
            <>
              {/* Result count header */}
              <div
                className="px-4 py-2 text-[10px] font-semibold tracking-widest uppercase sticky top-0"
                style={{
                  color: textSub,
                  backgroundColor: darkMode ? "#111111" : "#f8fafc",
                  borderBottom: `1px solid ${dropBorder}`,
                }}
              >
                {t('search.resultsCount', { count: results.length, query })}
              </div>

              {/* Grouped results */}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div
                    className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase"
                    style={{
                      color: categoryColor(category, darkMode),
                      backgroundColor: darkMode
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(0,0,0,0.02)",
                    }}
                  >
                    {category}
                  </div>

                  {items.map((item) => {
                    const globalIdx = results.indexOf(item);
                    const isActive = globalIdx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-100"
                        style={{
                          backgroundColor: isActive
                            ? darkMode
                              ? "rgba(52,211,153,0.1)"
                              : "rgba(22,163,74,0.06)"
                            : "transparent",
                          borderLeft: isActive
                            ? `2px solid ${darkMode ? "#34d399" : "#16a34a"}`
                            : "2px solid transparent",
                        }}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                      >
                        <span
                          className="shrink-0 mt-0.5 p-1.5 rounded-md"
                          style={{
                            backgroundColor: categoryColor(category, darkMode) + "18",
                            color: categoryColor(category, darkMode),
                          }}
                        >
                          {iconMap[item.icon]}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold leading-snug truncate"
                            style={{ color: textMain }}
                          >
                            {t(item.titleKey)}
                          </p>
                          <p
                            className="text-xs leading-relaxed mt-0.5 line-clamp-1"
                            style={{ color: textSub }}
                          >
                            {t(item.descriptionKey)}
                          </p>
                        </div>

                        <ChevronRight
                          size={14}
                          className="shrink-0 mt-1 opacity-30"
                          style={{ color: textSub }}
                        />
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Footer hint */}
              <div
                className="px-4 py-2 text-[10px] flex items-center gap-3 sticky bottom-0"
                style={{
                  color: textSub,
                  backgroundColor: darkMode
                    ? "rgba(0,0,0,0.6)"
                    : "rgba(255,255,255,0.9)",
                  borderTop: `1px solid ${dropBorder}`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span>{t('search.navigate')}</span>
                <span>{t('search.open')}</span>
                <span>{t('search.close')}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MOBILE SEARCH OVERLAY - WITH i18n
═══════════════════════════════════════════════════════ */
const MobileSearchOverlay = ({ isOpen, onClose, darkMode }) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col"
      style={{
        backgroundColor: darkMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.98)",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
      >
        <div className="flex-1">
          <GlobalSearchBar isMobile onClose={onClose} />
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-2 rounded-full"
          style={{ color: darkMode ? "#94a3b8" : "#64748b" }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 py-4">
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}
        >
          {t('search.popularTopics')}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Energy Flow",
            "Succession",
            "Food Web",
            "Trophic Levels",
            "Pioneer Species",
            "Biomes",
            "Quiz",
          ].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: darkMode
                  ? "rgba(52,211,153,0.08)"
                  : "rgba(22,163,74,0.08)",
                color: darkMode ? "#34d399" : "#16a34a",
                border: `1px solid ${
                  darkMode ? "rgba(52,211,153,0.15)" : "rgba(22,163,74,0.15)"
                }`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   USER MENU DROPDOWN (FOR LOGGED IN USERS) - WITH i18n
═══════════════════════════════════════════════════════ */
const UserMenu = ({ user, logout, isPremium }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(); // ✅ Add translation
  const { darkMode, toggleDarkMode } = useDarkMode();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const getAvatarUrl = () => {
    if (!user) return null;
    const photoUrl = user.photoURL || user.profilePicture || user.avatar;
    if (photoUrl && photoUrl.includes("googleusercontent.com")) {
      return photoUrl.replace(/=s\d+-c/, "=s400-c");
    }
    return photoUrl;
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarUrl = getAvatarUrl();

  const dropBg = darkMode ? "#111111" : "#ffffff";
  const dropBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const dividerC = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const itemText = darkMode ? "#cbd5e1" : "#374151";
  const itemHover = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full focus:outline-none relative"
        style={{
          boxShadow: isOpen ? `0 0 0 2px ${darkMode ? "#34d399" : "#16a34a"}` : "none",
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.displayName || "User"}
            className="w-9 h-9 rounded-full object-cover"
            style={{
              border: `2px solid ${
                darkMode ? "rgba(52,211,153,0.3)" : "rgba(22,163,74,0.3)"
              }`,
            }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
              border: `2px solid ${
                darkMode ? "rgba(52,211,153,0.3)" : "rgba(22,163,74,0.3)"
              }`,
            }}
          >
            <UserCircle size={18} style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
          </div>
        )}
        {/* Premium badge on avatar */}
        {isPremium && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px]"
            style={{ backgroundColor: "#fbbf24", border: "1.5px solid " + (darkMode ? "#111" : "#fff") }}
          >
            ⭐
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-60 rounded-2xl py-2 z-50 overflow-hidden"
          style={{
            backgroundColor: dropBg,
            border: `1px solid ${dropBorder}`,
            boxShadow: darkMode
              ? "0 20px 60px rgba(0,0,0,0.8)"
              : "0 8px 40px rgba(0,0,0,0.12)",
          }}
        >
          {/* User info */}
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${dividerC}` }}>
            <p className="text-sm font-bold" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>
              {t('header.greeting', { name: user?.displayName || user?.name || user?.email?.split("@")[0] || "User" })}
            </p>
            <p
              className="text-xs mt-0.5 truncate"
              style={{ color: darkMode ? "#475569" : "#94a3b8" }}
            >
              {user?.email}
            </p>
          </div>

          {/* Complete profile CTA */}
          <div className="px-3 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/complete-profile");
              }}
              className="flex items-center w-full gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{
                backgroundColor: darkMode
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(22,163,74,0.08)",
                color: darkMode ? "#34d399" : "#16a34a",
              }}
            >
              <CheckCircle size={15} />
              {t('header.completeProfile')}
            </button>
          </div>

          {/* 💎 Premium Status */}
          <div className="px-3 pb-2">
            {isPremium ? (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(251,191,36,0.1)"
                    : "rgba(217,119,6,0.08)",
                  color: darkMode ? "#fbbf24" : "#d97706",
                  border: `1px solid ${
                    darkMode ? "rgba(251,191,36,0.2)" : "rgba(217,119,6,0.15)"
                  }`,
                }}
              >
                <Star size={14} />
                {t('header.premium.active')}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/upgrade");
                }}
                className="flex items-center w-full gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(251,191,36,0.08)"
                    : "rgba(217,119,6,0.06)",
                  color: darkMode ? "#fbbf24" : "#d97706",
                  border: `1px solid ${
                    darkMode ? "rgba(251,191,36,0.2)" : "rgba(217,119,6,0.15)"
                  }`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = darkMode
                    ? "rgba(251,191,36,0.15)"
                    : "rgba(217,119,6,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = darkMode
                    ? "rgba(251,191,36,0.08)"
                    : "rgba(217,119,6,0.06)")
                }
              >
                <Star size={14} />
                {t('header.premium.start')}
              </button>
            )}
          </div>

          <div style={{ height: "1px", backgroundColor: dividerC, margin: "4px 0" }} />

          {/* Nav links */}
          <div className="px-2">
            {[
              { to: "/profile", icon: <User size={15} />, label: t('header.nav.profile') },
              { to: "/dashboard", icon: <LayoutDashboard size={15} />, label: t('header.nav.dashboard') },
              { to: "/quiz-history", icon: <History size={15} />, label: t('header.nav.quizHistory') },
              { to: "/settings", icon: <Settings size={15} />, label: t('header.nav.settings') },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                style={{ color: itemText }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = itemHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div style={{ height: "1px", backgroundColor: dividerC, margin: "4px 0" }} />

          {/* Dark mode toggle */}
          <div className="px-2">
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={{ color: darkMode ? "#fbbf24" : "#374151" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = itemHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {darkMode ? (
                <>
                  <Sun size={15} /> {t('header.darkMode.light')}
                </>
              ) : (
                <>
                  <Moon size={15} /> {t('header.darkMode.dark')}
                </>
              )}
            </button>
          </div>

          <div style={{ height: "1px", backgroundColor: dividerC, margin: "4px 0" }} />

          {/* Logout */}
          <div className="px-2 pb-1">
            <button
              onClick={async () => {
                await logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors text-red-400"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = itemHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LogOut size={15} />
              {t('header.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   GUEST MENU DROPDOWN (FOR LOGGED OUT USERS) - WITH i18n
═══════════════════════════════════════════════════════ */
const GuestMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(); // ✅ Add translation
  const { darkMode, toggleDarkMode } = useDarkMode();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropBg = darkMode ? "#111111" : "#ffffff";
  const dropBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const dividerC = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const itemText = darkMode ? "#cbd5e1" : "#374151";
  const itemHover = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";

  return (
    <div className="relative" ref={menuRef}>
      {/* Guest Avatar trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full focus:outline-none"
        style={{
          boxShadow: isOpen ? `0 0 0 2px ${darkMode ? "#34d399" : "#16a34a"}` : "none",
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
            border: `2px solid ${
              darkMode ? "rgba(52,211,153,0.3)" : "rgba(22,163,74,0.3)"
            }`,
          }}
        >
          <UserCircle size={18} style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-60 rounded-2xl py-2 z-50 overflow-hidden"
          style={{
            backgroundColor: dropBg,
            border: `1px solid ${dropBorder}`,
            boxShadow: darkMode
              ? "0 20px 60px rgba(0,0,0,0.8)"
              : "0 8px 40px rgba(0,0,0,0.12)",
          }}
        >
          {/* Guest info */}
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${dividerC}` }}>
            <p className="text-sm font-bold" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>
              {t('header.guest.welcome')}
            </p>
            <p className="text-xs mt-0.5" style={{ color: darkMode ? "#475569" : "#94a3b8" }}>
              {t('header.guest.message')}
            </p>
          </div>

          {/* Login CTA */}
          <div className="px-3 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
              className="flex items-center w-full gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{
                backgroundColor: darkMode
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(22,163,74,0.08)",
                color: darkMode ? "#34d399" : "#16a34a",
              }}
            >
              <LogIn size={15} />
              {t('header.guest.login')}
            </button>
          </div>

          <div style={{ height: "1px", backgroundColor: dividerC, margin: "4px 0" }} />

          {/* Nav links - locked state */}
          <div className="px-2">
            {[
              { to: "/login", icon: <User size={15} />, label: t('header.nav.profile') },
              { to: "/login", icon: <LayoutDashboard size={15} />, label: t('header.nav.dashboard') },
              { to: "/login", icon: <History size={15} />, label: t('header.nav.quizHistory') },
              { to: "/login", icon: <Settings size={15} />, label: t('header.nav.settings') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsOpen(false);
                  navigate(item.to);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors opacity-60 cursor-pointer"
                style={{ color: itemText }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = itemHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{item.icon}</span>
                {item.label}
                <span
                  className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: darkMode ? "#1e293b" : "#e2e8f0",
                    color: darkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  {t('header.locked')}
                </span>
              </button>
            ))}
          </div>

          <div style={{ height: "1px", backgroundColor: dividerC, margin: "4px 0" }} />

          {/* Dark mode toggle */}
          <div className="px-2">
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={{ color: darkMode ? "#fbbf24" : "#374151" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = itemHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {darkMode ? (
                <>
                  <Sun size={15} /> {t('header.darkMode.light')}
                </>
              ) : (
                <>
                  <Moon size={15} /> {t('header.darkMode.dark')}
                </>
              )}
            </button>
          </div>

          <div style={{ height: "1px", backgroundColor: dividerC, margin: "4px 0" }} />

          {/* Sign Up CTA */}
          <div className="px-2 pb-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/register");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={{ color: darkMode ? "#34d399" : "#16a34a" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = itemHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <UserPlus size={15} />
              {t('header.guest.signup')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN HEADER - WITH i18n
═══════════════════════════════════════════════════════ */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { t, i18n } = useTranslation(); // ✅ Add translation
  const { darkMode } = useDarkMode();
  const { currentUser, logout, isPremium } = useAuth();
  const location = useLocation();

  // ✅ Debug: Log current language
  useEffect(() => {
    console.log('🌐 Current language:', i18n.language);
    console.log('📝 Header tagline translation:', t('header.tagline'));
  }, [i18n.language, t]);

  // ✅ Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setIsMobileMenuOpen(prev => prev); // Force re-render
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle(
      "overflow-hidden",
      isMobileMenuOpen || isMobileSearchOpen
    );
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  const navLinks = [
    { path: "/", name: t('header.nav.home'), icon: <Home className="w-3.5 h-3.5" /> },
    {
      path: "/visualizations",
      name: t('header.nav.visualizations'),
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
      path: "/succession",
      name: t('header.nav.succession'),
      icon: <Leaf className="w-3.5 h-3.5" />,
    },
    {
      path: "/energy-flow",
      name: t('header.nav.energyFlow'),
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    { path: "/quiz", name: t('header.nav.quiz'), icon: <Brain className="w-3.5 h-3.5" /> },
    { path: "/about", name: t('header.nav.about'), icon: <Info className="w-3.5 h-3.5" /> },
  ];

  // Header background with gradient similar to footer
  const headerBg = darkMode 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900' 
    : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50';
  
  const headerBorder = darkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.07)";
  
  const textMain = darkMode ? "#f1f5f9" : "#0f172a";
  const textSub = darkMode ? "#64748b" : "#64748b";
  const activeBg = darkMode
    ? "rgba(52,211,153,0.1)"
    : "rgba(22,163,74,0.08)";
  const activeText = darkMode ? "#34d399" : "#16a34a";
  const hoverBg = darkMode
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.04)";
  const mobileDivider = darkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.07)";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full ${headerBg} transition-colors duration-300`}
        style={{
          borderBottom: `1px solid ${headerBorder}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Background Pattern */}
        <div className={`absolute inset-0 ${
          darkMode ? 'opacity-3' : 'opacity-5'
        }`}>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className={`absolute top-2 left-4 ${
              darkMode ? 'text-emerald-500/5' : 'text-emerald-500/10'
            }`}
            style={{ animation: 'float 8s ease-in-out infinite' }}
          >
            <Leaf className="w-6 h-6" />
          </div>
          <div 
            className={`absolute bottom-2 right-4 ${
              darkMode ? 'text-green-500/5' : 'text-green-500/10'
            }`}
            style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }}
          >
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-3">

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden md:flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: darkMode ? "#065f46" : "#16a34a" }}
              >
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p
                  className="font-black text-base leading-tight"
                  style={{ color: textMain }}
                >
                  EcoInteract
                </p>
                <p className="text-[10px] leading-none" style={{ color: textSub }}>
                  {t('header.tagline')}
                </p>
              </div>
            </Link>

            {/* Center nav */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-3 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5"
                    style={{
                      backgroundColor: isActive ? activeBg : "transparent",
                      color: isActive ? activeText : textSub,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {link.icon}
                    {link.name}
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                        style={{ backgroundColor: activeText }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search + User/Guest Menu */}
            <div className="flex items-center gap-3 shrink-0">
              <GlobalSearchBar />
              {currentUser ? (
                <UserMenu user={currentUser} logout={logout} isPremium={isPremium} />
              ) : (
                <GuestMenu />
              )}
            </div>
          </div>

          {/* ── MOBILE LAYOUT ── */}
          <div className="md:hidden flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: darkMode ? "#065f46" : "#16a34a" }}
              >
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <p className="font-black text-base" style={{ color: textMain }}>
                EcoInteract
              </p>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search icon */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: textSub }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                aria-label="Open search"
              >
                <Search size={19} />
              </button>

              {/* User/Guest Menu */}
              {currentUser ? (
                <UserMenu user={currentUser} logout={logout} isPremium={isPremium} />
              ) : (
                <GuestMenu />
              )}

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: textSub }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── MOBILE DROPDOWN MENU ── */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden mt-3 pt-3"
              style={{ borderTop: `1px solid ${mobileDivider}` }}
            >
              <div className="space-y-0.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors"
                      style={{
                        backgroundColor: isActive ? activeBg : "transparent",
                        color: isActive ? activeText : textSub,
                      }}
                    >
                      {link.icon}
                      <span className="text-sm font-semibold">{link.name}</span>
                      {isActive && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: activeText }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Compact Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            className="w-full h-1.5" 
            viewBox="0 0 1200 40" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity={darkMode ? "0.2" : "0.05"}
              fill={darkMode ? "#10b981" : "#059669"}
            />
          </svg>
        </div>
      </header>

      {/* ── MOBILE SEARCH FULLSCREEN OVERLAY ── */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        darkMode={darkMode}
      />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
      `}</style>
    </>
  );
};

export default Header;