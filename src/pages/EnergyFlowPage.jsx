import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Sun, ChevronDown, Download, Share2, Clock, Crown, Sparkles, Lock } from 'lucide-react';

// Components
import EcosystemSelector  from '../components/ecology/EcosystemSelector';
import ViewModeToggle     from '../components/ecology/ViewModeToggle';
import EnergySimulator    from '../components/ecology/EnergySimulator';
import BiomassCalculator  from '../components/ecology/BiomassCalculator';
import TrophicPyramid     from '../components/ecology/TrophicPyramid';
import EnergyChart        from '../components/charts/EnergyChart';
import HistoricalChart    from '../components/charts/HistoricalChart';
import GlassCard          from '../components/ui/GlassCard';

// Data & Hooks
import { ecosystems }          from '../data/ecosystems';
import { useEnergySimulation } from '../hooks/useEnergySimulation';
import { useHistoricalData }   from '../hooks/useHistoricalData';
import { useDarkMode } from '../App';
import { useAuth } from '../context/AuthContext';

import '../styles/ecology-effects.css';

// ─── organism emoji helper ───────────────────────────────────────────────────
const EMOJI_MAP = {
  'Oak Trees': '🌳', 'Ferns': '🌿', 'Grasses': '🌱', 'Shrubs': '🪴',
  'Deer': '🦌', 'Rabbits': '🐇', 'Squirrels': '🐿️', 'Insects': '🐛',
  'Foxes': '🦊', 'Snakes': '🐍', 'Owls': '🦉', 'Raccoons': '🦝',
  'Wolves': '🐺', 'Bears': '🐻', 'Hawks': '🦅',
  'Phytoplankton': '🌱', 'Zooplankton': '🦐', 'Krill': '🦐', 'Small Fish': '🐟',
  'Herring': '🐟', 'Squid': '🦑', 'Jellyfish': '🎐', 'Tuna': '🐟',
  'Sharks': '🦈', 'Dolphins': '🐬', 'Cactus': '🌵', 'Kangaroo Rats': '🐀',
  'Desert Tortoise': '🐢', 'Roadrunner': '🐦', 'Lizards': '🦎',
  'Scorpions': '🦂', 'Coyotes': '🐺', 'Rattlesnakes': '🐍',
  'Fungi': '🍄', 'Bacteria': '🦠', 'Worms': '🪱', 'Crabs': '🦀',
};
const orgEmoji = org => EMOJI_MAP[org] || '🔹';

// ==================== LOCK CARD COMPONENT ====================
const LockCard = ({ isLoginLock, message, onNavigate, dark }) => {
  const bgColor = dark ? '#0d0d0d' : '#ffffff';
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textPrimary = dark ? '#ffffff' : '#111827';
  const textSecondary = dark ? '#9ca3af' : '#6b7280';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-md w-full p-8 rounded-2xl" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.8)' : '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`} 
          style={{ backgroundColor: isLoginLock ? (dark ? '#1e1e1e' : '#f3f4f6') : 'rgba(234,179,8,0.15)' }}>
          {isLoginLock ? (
            <Lock className="w-8 h-8" style={{ color: dark ? '#9ca3af' : '#6b7280' }} />
          ) : (
            <Crown className="w-8 h-8 text-yellow-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>
          {isLoginLock ? 'Login Required' : 'Premium Feature'}
        </h2>
        <p className="text-sm mb-6" style={{ color: textSecondary }}>{message}</p>
        <button
          onClick={onNavigate}
          className={`w-full px-6 py-3 text-white font-semibold rounded-xl transition-all ${isLoginLock ? '' : 'flex items-center justify-center gap-2'}`}
          style={isLoginLock 
            ? { backgroundColor: '#16a34a' }
            : { background: 'linear-gradient(to right, #eab308, #f59e0b)' }
          }
          onMouseEnter={e => {
            if (isLoginLock) e.currentTarget.style.backgroundColor = '#15803d';
            else e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={e => {
            if (isLoginLock) e.currentTarget.style.backgroundColor = '#16a34a';
            else e.currentTarget.style.opacity = '1';
          }}
        >
          {!isLoginLock && <Sparkles className="w-4 h-4" />}
          {isLoginLock ? 'Login Now' : 'Upgrade to Premium'}
        </button>
      </div>
    </div>
  );
};

export default function EnergyFlowPage() {
  const { darkMode } = useDarkMode();
  const { isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  const D = darkMode;

  const [viewMode, setViewMode] = useState('pyramid');
  const [showCalculator, setShowCalculator] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [historicalMultiplier, setHistoricalMultiplier] = useState(1);
  const [selectedHistoricalYear, setSelectedHistoricalYear] = useState(2024);

  const location = useLocation();

  const {
    ecosystemId, currentEcosystem,
    producerEnergy, setProducerEnergy,
    simulationSpeed, setSimulationSpeed,
    isAnimating, setIsAnimating,
    energyLevels, energyHistory, energyLoss,
    resetSimulation, changeEcosystem,
  } = useEnergySimulation('forest');

  const {
    historicalData, loading: histLoading, error: histError,
    selectedYear, setSelectedYear, getPopulationMultiplier,
  } = useHistoricalData(ecosystemId, 'IN');

  // Scroll to hash
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  // Update multiplier when year changes
  useEffect(() => {
    if (selectedYear) {
      setSelectedHistoricalYear(selectedYear);
      setHistoricalMultiplier(getPopulationMultiplier(selectedYear));
    }
  }, [selectedYear, getPopulationMultiplier]);

  const adjustedProducerEnergy = producerEnergy * historicalMultiplier;

  // ── style tokens ──────────────────────────────────────────────
  const pageSt  = D ? { backgroundColor: '#000000', color: '#f3f4f6', minHeight: '100vh' } : { minHeight: '100vh' };
  const cardSt  = D ? { backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,1)' } : { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' };
  const panelSt = D ? { backgroundColor: '#111111' } : { backgroundColor: '#f9fafb' };
  const HT = D ? 'text-white' : 'text-gray-900';
  const ST = D ? 'text-gray-400' : 'text-gray-500';
  const LT = D ? 'text-gray-300' : 'text-gray-600';
  const dividerSt = { borderColor: D ? 'rgba(255,255,255,0.07)' : '#e5e7eb' };

  // ==================== RENDER VIEW MODE CONTENT ====================
  const renderViewModeContent = () => {
    // PYRAMID - FREE (हमेशा दिखेगा)
    if (viewMode === 'pyramid') {
      return (
        <TrophicPyramid
          levels={energyLevels.map(l => ({ ...l, energy: l.energy * historicalMultiplier }))}
          darkMode={D}
          onLevelClick={lvl => { setSelectedInfo(lvl); setShowDetails(true); }}
        />
      );
    }

    // CHAIN, WEB, GRAPH - सब premium चाहिए
    if (!isAuthenticated) {
      return (
        <LockCard 
          isLoginLock={true}
          message="Please login to access food chains, food webs, and energy graphs."
          onNavigate={() => navigate("/login")}
          dark={D}
        />
      );
    }

    if (!isPremium) {
      return (
        <LockCard 
          isLoginLock={false}
          message="Upgrade to premium to access food chains, food webs, and energy graphs."
          onNavigate={() => navigate("/premium")}
          dark={D}
        />
      );
    }

    // PREMIUM USER - अब ही ये views दिखेंगे
    switch(viewMode) {
      case 'chain':
        return (
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 py-6 sm:py-8">
            {currentEcosystem.trophicLevels.map((level, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: i * 0.12, type: 'spring' }}
                  className="text-center group cursor-pointer"
                  onClick={() => { setSelectedInfo(level); setShowDetails(true); }}
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-1.5 transition-all group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: level.color + '20', border: `2px solid ${level.color}` }}
                  >
                    {level.icon}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm" style={{ color: D ? '#d1d5db' : '#374151' }}>
                    {level.level.split(' ')[0]}
                  </div>
                  <div className="text-xs" style={{ color: D ? '#9ca3af' : '#6b7280' }}>{level.organisms.length} sp.</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: level.color }}>
                    {(level.energy * historicalMultiplier).toFixed(0)} kcal
                  </div>
                </motion.div>
                {i < currentEcosystem.trophicLevels.length - 1 && (
                  <motion.span
                    className="text-xl sm:text-2xl"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </div>
        );

      case 'web':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-4">
            {Object.entries(currentEcosystem.foodWeb).map(([key, organisms], idx) => (
              <motion.div
                key={key}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.07 }}
                className="p-2.5 sm:p-3 rounded-xl"
                style={panelSt}
              >
                <h4 className="font-semibold mb-2 capitalize text-xs sm:text-sm" style={{ color: D ? '#d1d5db' : '#374151' }}>
                  {key}
                </h4>
                <div className="space-y-1">
                  {organisms.map((org, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs" style={{ color: D ? '#9ca3af' : '#6b7280' }}>
                      <span className="text-sm">{orgEmoji(org)}</span>
                      <span className="truncate">{org}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'graph':
        return (
          <div className="p-1 sm:p-2">
            <EnergyChart
              data={energyHistory.map(p => ({
                ...p,
                producer: p.producer * historicalMultiplier,
                primary:  p.primary  * historicalMultiplier,
                secondary:p.secondary* historicalMultiplier,
                tertiary: p.tertiary * historicalMultiplier,
              }))}
              darkMode={D}
              height={300}
            />
            <div className="flex flex-wrap justify-between items-center mt-3 px-1 gap-2">
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1.5 text-xs rounded-full text-white transition-colors"
                  style={{ backgroundColor: '#2563eb' }}>
                  📈 10% Rule
                </button>
                <button className="px-3 py-1.5 text-xs rounded-full transition-colors"
                  style={panelSt}>
                  <span style={{ color: D ? '#9ca3af' : '#6b7280' }}>🔍 Zoom</span>
                </button>
              </div>
              <span className="text-xs" style={{ color: D ? '#6b7280' : '#9ca3af' }}>
                {energyHistory.length} data points
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== RENDER BIOMASS CALCULATOR ====================
  const renderBiomassCalculator = () => {
    if (!showCalculator) return null;

    if (!isAuthenticated) {
      return (
        <motion.section
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 250, damping: 28 }}
        >
          <LockCard 
            isLoginLock={true}
            message="Please login to use the biomass calculator."
            onNavigate={() => navigate("/login")}
            dark={D}
          />
        </motion.section>
      );
    }

    if (!isPremium) {
      return (
        <motion.section
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 250, damping: 28 }}
        >
          <LockCard 
            isLoginLock={false}
            message="Biomass calculator requires premium membership."
            onNavigate={() => navigate("/premium")}
            dark={D}
          />
        </motion.section>
      );
    }

    return (
      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 250, damping: 28 }}
      >
        <BiomassCalculator
          energyLevels={energyLevels.map(l => ({
            ...l,
            energy: l.energy  * historicalMultiplier,
            biomass: l.biomass * historicalMultiplier,
          }))}
          darkMode={D}
          currentEcosystem={currentEcosystem}
        />
      </motion.section>
    );
  };

  return (
    <div
      className={`transition-all duration-300 ${D ? 'text-gray-100' : 'bg-gradient-to-b from-green-50 via-white to-green-50 text-gray-900'}`}
      style={pageSt}
    >

      {/* ══ HERO SECTION ═══════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-b ${D ? 'from-black/90 via-black/60 to-black/90' : 'from-black/50 via-transparent to-black/50'} z-10`} />
          <motion.img
            src={currentEcosystem.heroImage}
            alt={currentEcosystem.name}
            className="w-full h-full object-cover"
            animate={{ scale: isAnimating ? 1.05 : 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/15 text-2xl"
              initial={{ x: Math.random() * 1200, y: Math.random() * 600, scale: 0 }}
              animate={{ y: [null, -40, 40, -40], scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 4 }}
            >
              {['☀️', '🌿', '⚡', '🔄'][i % 4]}
            </motion.div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative h-full flex items-center justify-center text-center px-4 z-20">
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 rounded-full flex items-center justify-center border-4 border-white/25"
              style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.3), rgba(34,197,94,0.3))', backdropFilter: 'blur(12px)' }}
            >
              <Sun className="text-yellow-400 animate-pulse" size={40} />
            </motion.div>

            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-3 drop-shadow-lg"
            >
              {currentEcosystem.name}
            </motion.h1>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto mb-6 drop-shadow px-4"
            >
              {currentEcosystem.longDescription}
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto"
            >
              {Object.entries(currentEcosystem.stats).slice(0, 4).map(([key, val], i) => (
                <div key={i} className="rounded-xl p-2.5 sm:p-3 text-center"
                  style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="text-white/60 text-xs uppercase tracking-wide">{key}</div>
                  <div className="text-white font-bold text-xs sm:text-sm mt-0.5">{val}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2">
              <ChevronDown className="text-white animate-bounce" size={28} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">

        {/* ── Ecosystem Selector ─────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
            <h2 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${HT}`}>
              <span className="text-3xl sm:text-4xl">🌍</span> Choose Ecosystem
            </h2>
            <div className="flex gap-2 flex-wrap">
              {[
                { icon: <Share2 size={15} />, label: 'Share' },
                { icon: <Download size={15} />, label: 'Export Data' },
              ].map(btn => (
                <button
                  key={btn.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    ...panelSt,
                    border: D ? '1px solid rgba(255,255,255,0.10)' : '1px solid #e5e7eb',
                    color: D ? '#d1d5db' : '#374151',
                  }}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
          </div>
          <EcosystemSelector selectedEco={ecosystemId} onSelect={changeEcosystem} darkMode={D} />
        </section>

        {/* ── Historical year badge ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ ...panelSt, border: D ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb' }}
          >
            <Clock size={14} className="text-green-500" />
            <span className={ST}>Viewing:</span>
            <span className="font-mono font-bold text-green-500">{selectedHistoricalYear}</span>
            <span className={`text-xs ${ST}`}>({historicalMultiplier.toFixed(2)}x)</span>
          </div>
        </motion.div>

        {/* ── Historical Data Chart ──────────────────────────────────────── */}
        <section className="rounded-2xl overflow-hidden" style={cardSt}>
          <div className="p-4 sm:p-6 border-b" style={dividerSt}>
            <div className="flex items-center gap-2">
              <Clock className="text-green-500 flex-shrink-0" size={22} />
              <h3 className={`text-xl sm:text-2xl font-bold ${HT}`}>Historical Ecosystem Data (1900–2024)</h3>
              {histLoading && <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {histError ? (
              <div className="p-4 rounded-lg text-red-500" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                Error: {histError}
              </div>
            ) : (
              <>
                <HistoricalChart data={historicalData} darkMode={D} height={260} onYearHover={setSelectedYear} />

                {historicalData.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
                    {[
                      { label: 'Population Change', val: `${((historicalData[historicalData.length - 1].population / historicalData[0].population - 1) * 100).toFixed(1)}%`, color: '#22c55e' },
                      { label: 'Forest Loss', val: `${((1 - historicalData[historicalData.length - 1].forestArea / historicalData[0].forestArea) * 100).toFixed(1)}%`, color: '#ef4444' },
                      { label: 'Biodiversity', val: `${historicalData[historicalData.length - 1].biodiversity > historicalData[0].biodiversity ? '↑' : '↓'}${Math.abs((historicalData[historicalData.length - 1].biodiversity / historicalData[0].biodiversity - 1) * 100).toFixed(1)}%`, color: '#eab308' },
                      { label: 'Energy Multiplier', val: `${historicalMultiplier.toFixed(2)}x`, color: '#3b82f6' },
                    ].map((s, i) => (
                      <div key={i} className="p-2.5 sm:p-3 rounded-xl" style={panelSt}>
                        <div className={`text-xs ${ST}`}>{s.label}</div>
                        <div className="text-base sm:text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="mt-4 p-3 sm:p-4 rounded-xl"
                  style={{ backgroundColor: D ? 'rgba(59,130,246,0.06)' : '#eff6ff', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  <p className="text-xs sm:text-sm" style={{ color: D ? '#60a5fa' : '#1d4ed8' }}>
                    <span className="font-bold">📊 Year {selectedHistoricalYear}:</span>{' '}
                    Energy values adjusted by {historicalMultiplier.toFixed(2)}x. Biodiversity has{' '}
                    {historicalMultiplier < 1 ? 'declined' : 'increased'} since 1900.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── View Mode Toggle ───────────────────────────────────────────── */}
        <section className="flex justify-center">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} darkMode={D} />
        </section>

        {/* ── Main Visualization + Energy Simulator ─────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Visualization panel (2/3) */}
          <div className="lg:col-span-2">
            <GlassCard darkMode={D}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className={`text-base sm:text-xl font-bold flex items-center gap-2 flex-wrap ${HT}`}>
                  <span className="text-xl sm:text-2xl">{currentEcosystem.emoji}</span>
                  <span className="truncate max-w-[200px] sm:max-w-none">{currentEcosystem.name}</span>
                  <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full font-semibold capitalize"
                    style={{ backgroundColor: D ? '#0a1a0a' : '#dcfce7', color: D ? '#4ade80' : '#15803d' }}>
                    {viewMode} · {selectedHistoricalYear}
                  </span>
                </h3>
              </div>

              {/* View Mode Content - Pyramid free, बाकी locked */}
              {renderViewModeContent()}

            </GlassCard>
          </div>

          {/* Energy Simulator (1/3) */}
          <div className="lg:col-span-1">
            <EnergySimulator
              producerEnergy={adjustedProducerEnergy}
              originalProducerEnergy={producerEnergy}
              setProducerEnergy={setProducerEnergy}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
              simulationSpeed={simulationSpeed}
              setSimulationSpeed={setSimulationSpeed}
              darkMode={D}
              energyLevels={energyLevels}
              energyLoss={energyLoss}
              historicalMultiplier={historicalMultiplier}
              selectedYear={selectedHistoricalYear}
            />
          </div>
        </section>

        {/* ── Biomass Calculator Toggle Button ──────────────────────────── */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCalculator(v => !v)}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-white transition-all"
            style={{
              background: showCalculator
                ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                : 'linear-gradient(135deg, #16a34a, #10b981)',
              boxShadow: showCalculator
                ? '0 8px 28px rgba(220,38,38,0.35)'
                : '0 8px 28px rgba(16,185,129,0.35)',
            }}
          >
            <span className="text-lg">{showCalculator ? '📊' : '📈'}</span>
            {showCalculator ? 'Hide Biomass Calculator' : 'Show Advanced Biomass Calculator'}
            <motion.span
              animate={{ rotate: showCalculator ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-white/70"
            >
              ▼
            </motion.span>
          </motion.button>
        </div>

        {/* ── Biomass Calculator (animated expand/collapse) ─────── */}
        <AnimatePresence>
          {renderBiomassCalculator()}
        </AnimatePresence>

        {/* ── Quick Facts Grid (FREE) ───────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {currentEcosystem.trophicLevels.map((level, i) => (
            <GlassCard key={i} darkMode={D} padding="p-3 sm:p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: level.color + '20' }}
                >
                  {level.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs sm:text-sm ${ST} truncate`}>{level.level}</div>
                  <div className={`font-bold text-sm ${HT}`}>{level.organisms.length} species</div>
                </div>
              </div>
              <p className={`text-xs leading-relaxed ${ST}`}>{level.fact}</p>
            </GlassCard>
          ))}
        </section>
      </div>

      {/* ══ Info Modal ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showDetails && selectedInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ backgroundColor: D ? '#0d0d0d' : '#ffffff', boxShadow: '0 24px 80px rgba(0,0,0,1)' }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="h-28 sm:h-32 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentEcosystem.heroImage})`, backgroundColor: selectedInfo.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                >
                  ✕
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl flex-shrink-0">{selectedInfo.icon}</span>
                  <div className="min-w-0">
                    <h3 className={`text-xl sm:text-2xl font-bold ${HT}`}>{selectedInfo.level || selectedInfo.fullName}</h3>
                    <p className={`text-sm ${ST}`}>
                      Energy: {Math.round((selectedInfo.energy || 0) * historicalMultiplier).toLocaleString()} kcal
                      <span className="text-xs ml-2 text-green-500">(Year {selectedHistoricalYear})</span>
                    </p>
                  </div>
                </div>

                <p className={`mb-4 text-sm leading-relaxed ${LT}`}>{selectedInfo.details}</p>

                <div className="p-3 rounded-xl mb-4 text-sm" style={panelSt}>
                  <span className="font-semibold">Fun Fact:</span>{' '}
                  <span className={ST}>{selectedInfo.fact}</span>
                </div>

                {selectedInfo.organisms?.length > 0 && (
                  <>
                    <h4 className={`font-semibold mb-2 text-sm ${HT}`}>Organisms:</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedInfo.organisms.map((org, i) => (
                        <div key={i} className="p-2 rounded-lg text-center text-xs" style={panelSt}>
                          <span className="text-xl block mb-0.5">{org.emoji || '🔹'}</span>
                          <span className={ST}>{org.name || org}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}