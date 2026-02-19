import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, TrendingDown, Leaf, Activity, Info, ChevronDown,
  Zap, BarChart2, RefreshCcw, Target, Flame, Droplets, Wind,
  ArrowRight, Eye, EyeOff, Download, Star,
  AlertTriangle, CheckCircle, TrendingUp, Layers,
} from 'lucide-react';

// ─── Organism icon map ───────────────────────────────────────────────────────
const ORG_ICONS = {
  'Oak Trees': '🌳', 'Ferns': '🌿', 'Grasses': '🌱', 'Shrubs': '🪴',
  'Deer': '🦌', 'Rabbits': '🐇', 'Squirrels': '🐿️', 'Insects': '🐛',
  'Foxes': '🦊', 'Snakes': '🐍', 'Owls': '🦉', 'Raccoons': '🦝',
  'Wolves': '🐺', 'Bears': '🐻', 'Hawks': '🦅',
  'Phytoplankton': '🌱', 'Zooplankton': '🦐', 'Krill': '🦐', 'Small Fish': '🐟',
  'Herring': '🐟', 'Squid': '🦑', 'Jellyfish': '🎐', 'Tuna': '🐟',
  'Sharks': '🦈', 'Dolphins': '🐬', 'Cactus': '🌵', 'Kangaroo Rats': '🐀',
  'Desert Tortoise': '🐢', 'Roadrunner': '🐦', 'Lizards': '🦎',
  'Scorpions': '🦂', 'Coyotes': '🐺', 'Rattlesnakes': '🐍',
};

const MASS_MAP = {
  'Tree': 500, 'Deer': 100, 'Rabbit': 2, 'Squirrel': 0.5,
  'Fox': 6, 'Wolf': 45, 'Bear': 200, 'Snake': 1.5, 'Owl': 1.5,
  'Hawk': 1.2, 'Raccoon': 6, 'Insect': 0.001,
  'Phytoplankton': 0.000001, 'Zooplankton': 0.0005,
  'Fish': 0.5, 'Tuna': 80, 'Shark': 500, 'Dolphin': 150,
  'Cactus': 100, 'Coyote': 15, 'Tortoise': 10, 'Lizard': 0.2,
  'Scorpion': 0.05, 'Rattlesnake': 2, 'Roadrunner': 0.4,
};

const getAvgMass = (name = '') => {
  for (const [key, mass] of Object.entries(MASS_MAP)) {
    if (name.includes(key)) return mass;
  }
  return 1;
};

const getHealthLabel = (score) => {
  if (score >= 80) return { label: 'Excellent', color: '#22c55e', icon: '🌿' };
  if (score >= 60) return { label: 'Good',      color: '#84cc16', icon: '✅' };
  if (score >= 40) return { label: 'Moderate',  color: '#eab308', icon: '⚠️' };
  if (score >= 20) return { label: 'Poor',       color: '#f97316', icon: '🔻' };
  return             { label: 'Critical',  color: '#ef4444', icon: '🚨' };
};

const calcCarbon = (biomass, effPct) => {
  const seq = biomass * 0.45;
  return {
    sequestration: seq.toFixed(1),
    release: (seq * (1 - effPct / 100)).toFixed(1),
  };
};

// ✅ The KEY fix: range slider with custom visible track via wrapper div
const SliderWithTrack = ({
  min, max, step = 1, value, onChange,
  fillColor = '#22c55e', emptyColor,
  darkMode,
  thumbBorderColor,
  extraClass = '',
}) => {
  const D = darkMode;
  const empty = emptyColor || (D ? '#2d2d2d' : '#d1d5db');
  const thumbBorder = thumbBorderColor || (D ? '#000000' : '#ffffff');
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* ✅ Visible gradient track rendered as a normal div */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 8,
          borderRadius: 4,
          transform: 'translateY(-50%)',
          background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, ${empty} ${pct}%, ${empty} 100%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Native range on top — transparent so track div shows */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`bmc-slider ${extraClass}`}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: 28,
          margin: 0,
          padding: 0,
          cursor: 'pointer',
          zIndex: 1,
          // Make track transparent in all browsers
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          background: 'transparent',
          outline: 'none',
          border: 'none',
        }}
        // Inline data attributes for the injected CSS
        data-fill={fillColor}
        data-border={thumbBorder}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const BiomassCalculator = ({ energyLevels = [], darkMode, currentEcosystem }) => {
  const D = darkMode;

  const [producerBiomass, setProducerBiomass]    = useState(5000);
  const [selectedLevel, setSelectedLevel]         = useState(null);
  const [calcMode, setCalcMode]                   = useState('standard');
  const [efficiency, setEfficiency]               = useState(10);
  const [history, setHistory]                     = useState([]);
  const [activeTab, setActiveTab]                 = useState('overview');
  const [showRatioBar, setShowRatioBar]           = useState(true);
  const [animatePyramid, setAnimatePyramid]       = useState(false);
  const [compareEfficiency, setCompareEfficiency] = useState(5);
  const [highlightLevel, setHighlightLevel]       = useState(null);
  const [showTips, setShowTips]                   = useState(false);

  // ── Style tokens ──────────────────────────────────────────────────────────
  const HT      = { color: D ? '#ffffff'    : '#111827' };
  const ST      = { color: D ? '#9ca3af'    : '#6b7280' };
  const LT      = { color: D ? '#d1d5db'    : '#4b5563' };
  const cardSt  = {
    backgroundColor: D ? '#0d0d0d' : '#ffffff',
    border:          D ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
    boxShadow:       D ? '0 4px 24px rgba(0,0,0,0.95)'     : '0 2px 12px rgba(0,0,0,0.06)',
  };
  const panelSt  = { backgroundColor: D ? '#111111' : '#f9fafb' };
  const innerSt  = { backgroundColor: D ? '#0a0a0a' : '#f3f4f6' };
  const trackSt  = { backgroundColor: D ? '#1a1a1a' : '#e5e7eb' };
  const borderSt = { borderColor: D ? 'rgba(255,255,255,0.07)' : '#e5e7eb' };
  const numInputStyle = {
    ...innerSt,
    border:       D ? '1px solid rgba(255,255,255,0.10)' : '1px solid #d1d5db',
    color:        D ? '#ffffff' : '#111827',
    borderRadius: 8,
    padding:      '6px 10px',
    fontSize:     13,
    outline:      'none',
    flexShrink:   0,
  };

  // ── Calculations ──────────────────────────────────────────────────────────
  const calcLevels = useCallback((eff = efficiency) => {
    const effFrac = eff / 100;
    const base = energyLevels.length > 0 ? energyLevels : [
      { level: 'Producers',           color: '#22c55e', icon: '🌿', energy: 10000, biomass: 5000, organisms: [], fact: 'Primary producers form the base of all food webs through photosynthesis.' },
      { level: 'Primary Consumers',   color: '#eab308', icon: '🦌', energy: 1000,  biomass: 500,  organisms: [], fact: 'Herbivores that directly consume producers.' },
      { level: 'Secondary Consumers', color: '#f97316', icon: '🦊', energy: 100,   biomass: 50,   organisms: [], fact: 'Carnivores that eat primary consumers.' },
      { level: 'Tertiary Consumers',  color: '#ef4444', icon: '🐺', energy: 10,    biomass: 5,    organisms: [], fact: 'Apex predators at the top of the food chain.' },
    ];
    return base.map((level, i) => {
      const biomass      = i === 0 ? producerBiomass : producerBiomass * Math.pow(effFrac, i);
      const energyPerKg  = level.energy / Math.max(level.biomass || 1, 0.001);
      const organisms    = (level.organisms || []).map(org => {
        const avgMass = getAvgMass(org.name || '');
        const pop     = Math.round(biomass / avgMass);
        return { ...org, avgMass, population: isFinite(pop) ? Math.max(pop, 0) : 0 };
      });
      const totalPop    = organisms.reduce((s, o) => s + (o.population || 0), 0);
      const prevBiomass = i === 0 ? producerBiomass : producerBiomass * Math.pow(effFrac, i - 1);
      return {
        ...level, biomass, energy: biomass * energyPerKg, energyPerKg,
        totalPopulation: totalPop, organisms,
        ecologicalEfficiency: i === 0 ? 100 : (biomass / prevBiomass) * 100,
        lossAmount:      i === 0 ? 0   : prevBiomass - biomass,
        lossPercentage:  i === 0 ? 0   : 100 - eff,
      };
    });
  }, [efficiency, producerBiomass, energyLevels]);

  const levels        = useMemo(() => calcLevels(efficiency),         [calcLevels, efficiency]);
  const compareLevels = useMemo(() => calcMode === 'compare' ? calcLevels(compareEfficiency) : [], [calcLevels, compareEfficiency, calcMode]);

  const totals = useMemo(() => ({
    biomass:    levels.reduce((s, l) => s + l.biomass, 0),
    energy:     levels.reduce((s, l) => s + l.energy,  0),
    population: levels.reduce((s, l) => s + (l.totalPopulation || 0), 0),
    avgEff:     levels.slice(1).reduce((s, l) => s + l.ecologicalEfficiency, 0) / Math.max(1, levels.length - 1),
    totalLoss:  levels.reduce((s, l) => s + l.lossAmount, 0),
  }), [levels]);

  const healthScore = Math.min(100, Math.max(0,
    (efficiency / 20) * 40 + (producerBiomass / 20000) * 40 + (levels.length / 4) * 20
  ));
  const health = getHealthLabel(healthScore);
  const carbon = calcCarbon(totals.biomass, efficiency);

  const scientificMetrics = useMemo(() => ({
    primaryProductivity:   (producerBiomass * 1.8).toFixed(0),
    secondaryProductivity: (producerBiomass * efficiency / 100 * 1.2).toFixed(0),
    biomassRatio:          (producerBiomass / Math.max(levels[levels.length - 1]?.biomass || 1, 0.001)).toFixed(0),
    respirationLoss:       (producerBiomass * 0.6).toFixed(0),
    decomposerBiomass:     (producerBiomass * 0.08).toFixed(0),
    nppGross:              (producerBiomass * 2.2).toFixed(0),
    nppNet:                (producerBiomass * 1.4).toFixed(0),
    energyFlowRate:        (producerBiomass * efficiency / 100 * 2).toFixed(0),
  }), [producerBiomass, efficiency, levels]);

  useEffect(() => {
    setHistory(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      producerBiomass, efficiency,
      healthScore: healthScore.toFixed(0),
      totals: { ...totals },
    }, ...prev].slice(0, 8));
  }, [producerBiomass, efficiency]);

  useEffect(() => {
    setAnimatePyramid(true);
    const t = setTimeout(() => setAnimatePyramid(false), 500);
    return () => clearTimeout(t);
  }, [producerBiomass, efficiency]);

  const handleExport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      ecosystem: currentEcosystem?.name || 'Unknown',
      producerBiomass, efficiency,
      levels: levels.map(l => ({
        level: l.level, biomass: l.biomass.toFixed(2),
        energy: l.energy.toFixed(2), population: l.totalPopulation,
        ecologicalEfficiency: l.ecologicalEfficiency.toFixed(1),
      })),
      totals: {
        biomass: totals.biomass.toFixed(2), energy: totals.energy.toFixed(2),
        population: totals.population, avgEfficiency: totals.avgEff.toFixed(1),
      },
      healthScore: healthScore.toFixed(0), carbonSequestration: carbon.sequestration,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `biomass-report-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const thumbBorderColor = D ? '#000000' : '#ffffff';

  // ═════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ✅ GLOBAL STYLES: injected once, overrides any conflicting global CSS */}
      <style>{`
        /* Reset webkit appearance completely for our sliders */
        .bmc-slider {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          background: transparent !important;
          outline: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          height: 28px !important;
          cursor: pointer !important;
          display: block !important;
        }

        /* ✅ Thumb styles — green by default */
        .bmc-slider::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          background: #22c55e !important;
          border: 3px solid ${thumbBorderColor} !important;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.5), 0 2px 8px rgba(0,0,0,0.4) !important;
          cursor: pointer !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
          margin-top: -7px !important;
        }
        .bmc-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25) !important;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.35), 0 4px 14px rgba(0,0,0,0.5) !important;
        }
        .bmc-slider::-moz-range-thumb {
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          background: #22c55e !important;
          border: 3px solid ${thumbBorderColor} !important;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.5) !important;
          cursor: pointer !important;
        }

        /* ✅ Track must be transparent so our custom div shows */
        .bmc-slider::-webkit-slider-runnable-track {
          background: transparent !important;
          height: 8px !important;
          border-radius: 4px !important;
        }
        .bmc-slider::-moz-range-track {
          background: transparent !important;
          height: 8px !important;
          border-radius: 4px !important;
        }

        /* Blue thumb for efficiency */
        .bmc-slider-eff::-webkit-slider-thumb {
          background: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.5), 0 2px 8px rgba(0,0,0,0.4) !important;
        }
        .bmc-slider-eff::-moz-range-thumb {
          background: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.5) !important;
        }

        /* Orange thumb for compare */
        .bmc-slider-cmp::-webkit-slider-thumb {
          background: #f97316 !important;
          box-shadow: 0 0 0 2px rgba(249,115,22,0.5), 0 2px 8px rgba(0,0,0,0.4) !important;
        }
        .bmc-slider-cmp::-moz-range-thumb {
          background: #f97316 !important;
          box-shadow: 0 0 0 2px rgba(249,115,22,0.5) !important;
        }
      `}</style>

      <div className="rounded-2xl overflow-hidden" style={cardSt}>

        {/* ══ HEADER ════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-6 border-b" style={borderSt}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                <Scale className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold" style={HT}>Ecological Biomass Calculator</h3>
                <p className="text-xs" style={ST}>Advanced trophic analysis · {efficiency}% transfer rule</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: health.color + '18', border: `1px solid ${health.color}40` }}>
                <span>{health.icon}</span>
                <span className="text-xs font-bold" style={{ color: health.color }}>{health.label}</span>
                <span className="text-xs font-mono" style={{ color: health.color }}>{healthScore.toFixed(0)}%</span>
              </div>
              <button onClick={handleExport} title="Export JSON"
                className="p-2 rounded-xl transition-all hover:opacity-80"
                style={{ ...panelSt, border: D ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb' }}>
                <Download size={16} style={ST} />
              </button>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap mt-4">
            {['standard', 'advanced', 'scientific', 'compare'].map(m => (
              <button key={m} onClick={() => setCalcMode(m)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={calcMode === m
                  ? { background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff' }
                  : { ...innerSt, ...LT }}>
                {m === 'scientific' ? '🔬 Scientific' : m === 'compare' ? '⚖️ Compare' : m}
              </button>
            ))}
          </div>
        </div>

        {/* ══ BODY ══════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-6 space-y-5">

          {/* ── INPUT CONTROLS ─────────────────────────────────────────── */}
          <div className={`grid gap-4 ${calcMode !== 'standard' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>

            {/* ── Biomass Panel ── */}
            <div className="p-4 rounded-xl" style={panelSt}>
              <label className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={LT}>
                <Leaf size={13} className="text-green-500" /> Producer Biomass (kg/ha)
              </label>

              <div className="flex items-center gap-3 mb-3">
                <input type="number" min="100" max="50000" step="100"
                  value={producerBiomass}
                  onChange={e => setProducerBiomass(Math.min(50000, Math.max(100, Number(e.target.value))))}
                  style={{ ...numInputStyle, width: 110 }}
                />
                <motion.span key={producerBiomass} initial={{ scale: 1.25, color: '#22c55e' }} animate={{ scale: 1 }}
                  className="font-mono font-bold text-sm" style={HT}>
                  {producerBiomass.toLocaleString()} kg/ha
                </motion.span>
              </div>

              {/* ✅ Custom slider with visible green track */}
              <SliderWithTrack
                min={100} max={20000} step={100}
                value={producerBiomass}
                onChange={setProducerBiomass}
                fillColor="#22c55e"
                darkMode={D}
              />

              <div className="flex justify-between mt-2 px-0.5">
                <span className="text-xs" style={ST}>100 kg</span>
                <span className="text-xs" style={ST}>20,000 kg</span>
              </div>

              <div className="flex gap-1.5 mt-3 flex-wrap">
                {[
                  { label: 'Desert',    val: 200   },
                  { label: 'Grassland', val: 2000  },
                  { label: 'Temperate', val: 5000  },
                  { label: 'Tropical',  val: 15000 },
                ].map(p => (
                  <button key={p.val} onClick={() => setProducerBiomass(p.val)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: producerBiomass === p.val ? '#22c55e' : D ? '#1a1a1a' : '#e5e7eb',
                      color: producerBiomass === p.val ? '#fff' : D ? '#9ca3af' : '#4b5563',
                      border: producerBiomass === p.val ? 'none' : D ? '1px solid rgba(255,255,255,0.08)' : '1px solid #d1d5db',
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Efficiency Panel (advanced/scientific/compare) ── */}
            {calcMode !== 'standard' && (
              <div className="p-4 rounded-xl" style={panelSt}>
                <label className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={LT}>
                  <Activity size={13} className="text-blue-500" /> Transfer Efficiency (%)
                </label>

                <div className="flex items-center gap-3 mb-3">
                  <input type="number" min="1" max="30" step="0.5"
                    value={efficiency}
                    onChange={e => setEfficiency(Math.min(30, Math.max(1, Number(e.target.value))))}
                    style={{ ...numInputStyle, width: 80 }}
                  />
                  <span className="font-mono font-bold text-sm text-blue-500">{efficiency}%</span>
                </div>

                {/* ✅ Custom slider with visible blue track */}
                <SliderWithTrack
                  min={1} max={30} step={0.5}
                  value={efficiency}
                  onChange={setEfficiency}
                  fillColor="#3b82f6"
                  darkMode={D}
                  extraClass="bmc-slider-eff"
                />

                <div className="flex justify-between mt-2 px-0.5">
                  <span className="text-xs" style={ST}>1% (low)</span>
                  <span className="text-xs" style={ST}>30% (high)</span>
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {[{ label: 'Typical', val: 10 }, { label: 'Marine', val: 15 }, { label: 'Hot Spring', val: 25 }].map(p => (
                    <button key={p.val} onClick={() => setEfficiency(p.val)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: efficiency === p.val ? '#3b82f6' : D ? '#1a1a1a' : '#e5e7eb',
                        color: efficiency === p.val ? '#fff' : D ? '#9ca3af' : '#4b5563',
                        border: efficiency === p.val ? 'none' : D ? '1px solid rgba(255,255,255,0.08)' : '1px solid #d1d5db',
                      }}>
                      {p.label}
                    </button>
                  ))}
                </div>

                {calcMode === 'compare' && (
                  <div className="mt-4 pt-4 border-t" style={borderSt}>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: '#f97316' }}>
                      ⚖️ Compare B (%)
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <input type="number" min="1" max="30" step="0.5"
                        value={compareEfficiency}
                        onChange={e => setCompareEfficiency(Math.min(30, Math.max(1, Number(e.target.value))))}
                        style={{ ...numInputStyle, width: 80 }}
                      />
                      <span className="font-mono font-bold text-sm text-orange-500">{compareEfficiency}%</span>
                    </div>
                    <SliderWithTrack
                      min={1} max={30} step={0.5}
                      value={compareEfficiency}
                      onChange={setCompareEfficiency}
                      fillColor="#f97316"
                      darkMode={D}
                      extraClass="bmc-slider-cmp"
                    />
                    <div className="flex justify-between mt-2 px-0.5">
                      <span className="text-xs" style={ST}>1%</span>
                      <span className="text-xs" style={ST}>30%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── VISUAL PYRAMID ─────────────────────────────────────────── */}
          <div className="p-4 rounded-xl" style={panelSt}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5" style={LT}>
                <Layers size={14} /> Visual Pyramid
              </h4>
              <button onClick={() => setShowRatioBar(!showRatioBar)}
                className="text-xs flex items-center gap-1" style={ST}>
                {showRatioBar ? <EyeOff size={12} /> : <Eye size={12} />}
                {showRatioBar ? 'Hide' : 'Show'} chart
              </button>
            </div>

            <div className="flex flex-col items-center gap-1.5 mb-2">
              {[...levels].reverse().map((lvl, revI) => {
                const i = levels.length - 1 - revI;
                const widthPct = 25 + revI * 18;
                return (
                  <motion.div key={i}
                    className="relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: animatePyramid ? lvl.color + '30' : lvl.color + '18',
                      border: `1.5px solid ${highlightLevel === i ? lvl.color : lvl.color + '55'}`,
                      boxShadow: highlightLevel === i ? `0 0 14px ${lvl.color}40` : 'none',
                    }}
                    whileHover={{ scale: 1.03 }}
                    onMouseEnter={() => setHighlightLevel(i)}
                    onMouseLeave={() => setHighlightLevel(null)}
                    animate={{ opacity: animatePyramid ? [0.7, 1] : 1 }}
                    transition={{ duration: 0.3 }}>
                    <span className="text-lg">{lvl.icon}</span>
                    <span className="text-xs font-bold truncate mx-2" style={{ color: lvl.color }}>
                      {lvl.level.split(' ')[0]}
                    </span>
                    <span className="text-xs font-mono" style={HT}>
                      {lvl.biomass >= 1000 ? `${(lvl.biomass / 1000).toFixed(1)}t` : `${lvl.biomass.toFixed(0)}kg`}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {calcMode === 'compare' && compareLevels.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold mb-2" style={{ color: '#f97316' }}>
                  A ({efficiency}%) vs B ({compareEfficiency}%)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((lvl, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg" style={innerSt}>
                      <span style={{ color: lvl.color }}>{lvl.level.split(' ')[0]}</span>
                      <div>
                        <span className="text-green-500 font-mono">{lvl.biomass.toFixed(0)}</span>
                        <span style={ST}> vs </span>
                        <span className="text-orange-500 font-mono">{(compareLevels[i]?.biomass || 0).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── TABS ───────────────────────────────────────────────────── */}
          <div className="flex gap-1 flex-wrap">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'levels',   label: 'Levels' },
              { key: 'carbon',   label: '🌱 Carbon' },
              { key: 'history',  label: '📋 History' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={activeTab === key ? { backgroundColor: '#22c55e', color: '#fff' } : { ...innerSt, ...LT }}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Biomass',  val: `${totals.biomass.toFixed(0)} kg`,  clr: '#22c55e', icon: <Leaf size={14}/> },
                    { label: 'Total Energy',   val: `${totals.energy.toFixed(0)} kcal`, clr: '#eab308', icon: <Zap size={14}/> },
                    { label: 'Population',     val: totals.population.toLocaleString(), clr: '#3b82f6', icon: <Target size={14}/> },
                    { label: 'Avg Efficiency', val: `${totals.avgEff.toFixed(1)}%`,     clr: '#a855f7', icon: <TrendingUp size={14}/> },
                  ].map((s, i) => (
                    <motion.div key={i} className="p-3 rounded-xl" style={panelSt} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <div className="flex items-center gap-1.5 mb-1" style={{ color: s.clr }}>{s.icon}
                        <span className="text-xs" style={ST}>{s.label}</span>
                      </div>
                      <div className="text-lg font-bold tabular-nums" style={{ color: s.clr }}>{s.val}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 rounded-xl"
                  style={{ backgroundColor: D ? 'rgba(239,68,68,0.06)' : '#fef2f2', border: D ? '1px solid rgba(239,68,68,0.18)' : '1px solid #fecaca' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Flame size={16} className="text-red-500"/>
                    <span className="font-semibold text-sm text-red-500">Total Energy Lost: {totals.totalLoss.toFixed(0)} kg</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Respiration', val: '60%', color: '#ef4444', icon: <Wind size={11}/> },
                      { label: 'Heat Loss',   val: '30%', color: '#f97316', icon: <Flame size={11}/> },
                      { label: 'Undigested',  val: '10%', color: '#eab308', icon: <Droplets size={11}/> },
                    ].map((s, i) => (
                      <div key={i} className="p-2 rounded-lg text-center" style={innerSt}>
                        <span style={{ color: s.color }} className="flex justify-center mb-0.5">{s.icon}</span>
                        <span className="block text-xs" style={ST}>{s.label}</span>
                        <span className="font-bold text-xs" style={{ color: s.color }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {calcMode === 'scientific' && (
                  <div className="p-4 rounded-xl" style={panelSt}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5" style={LT}>
                      <Star size={14} className="text-yellow-500"/> Scientific Metrics
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Gross NPP',        val: `${scientificMetrics.nppGross} g/m²/yr`,     clr: '#22c55e' },
                        { label: 'Net NPP',          val: `${scientificMetrics.nppNet} g/m²/yr`,       clr: '#84cc16' },
                        { label: 'Respiration Loss', val: `${scientificMetrics.respirationLoss} kg`,   clr: '#f97316' },
                        { label: 'Decomposer Bio.',  val: `${scientificMetrics.decomposerBiomass} kg`, clr: '#a855f7' },
                        { label: 'Primary Prod.',    val: `${scientificMetrics.primaryProductivity} kcal/yr`,   clr: '#eab308' },
                        { label: 'Secondary Prod.',  val: `${scientificMetrics.secondaryProductivity} kcal/yr`, clr: '#f97316' },
                        { label: 'Biomass Ratio',    val: `${scientificMetrics.biomassRatio}:1`,  clr: '#3b82f6' },
                        { label: 'Energy Flow',      val: `${scientificMetrics.energyFlowRate} kcal/d`, clr: '#ec4899' },
                      ].map((s, i) => (
                        <div key={i} className="p-2 rounded-lg" style={innerSt}>
                          <div className="text-xs mb-0.5" style={ST}>{s.label}</div>
                          <div className="font-mono font-bold text-xs" style={{ color: s.clr }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl"
                  style={{ backgroundColor: D ? 'rgba(34,197,94,0.05)' : '#f0fdf4', border: D ? '1px solid rgba(34,197,94,0.2)' : '1px solid #bbf7d0' }}>
                  <div className="flex items-start gap-2.5">
                    <Info size={15} className="text-green-500 mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={HT}>{efficiency}% Transfer Efficiency Applied</p>
                      <p className="text-xs leading-relaxed" style={ST}>
                        Each level retains only <strong style={{ color: '#22c55e' }}>{efficiency}%</strong> of previous biomass.
                        Tertiary consumers hold <strong style={{ color: '#ef4444' }}>{(Math.pow(efficiency / 100, 3) * 100).toFixed(3)}%</strong>.
                      </p>
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {levels.map((lvl, i) => (
                          <React.Fragment key={i}>
                            <span className="font-mono text-xs font-bold" style={{ color: lvl.color }}>{lvl.biomass.toFixed(0)}kg</span>
                            {i < levels.length - 1 && <span className="text-xs flex items-center gap-0.5" style={ST}><ArrowRight size={10}/><span style={{ color: '#22c55e' }}>{efficiency}%</span><ArrowRight size={10}/></span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {showRatioBar && (
                  <div className="p-4 rounded-xl" style={panelSt}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1" style={LT}>
                      <BarChart2 size={14}/> Biomass Chart
                    </h4>
                    <div className="flex items-end justify-center gap-2 sm:gap-4" style={{ height: 110 }}>
                      {levels.map((lvl, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <motion.div className="w-12 sm:w-16 rounded-t-lg" style={{ backgroundColor: lvl.color, minHeight: 4 }}
                            initial={{ height: 0 }}
                            animate={{ height: Math.max(8, (lvl.biomass / producerBiomass) * 90 + 8) }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}/>
                          <span className="text-xs" style={ST}>{lvl.level.split(' ')[0].slice(0, 5)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center mt-2" style={ST}>
                      {levels.map(l => `${(l.biomass / Math.max(levels[levels.length-1]?.biomass||1, 0.001)).toFixed(0)}`).join(' : ')}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* LEVELS TAB */}
            {activeTab === 'levels' && (
              <motion.div key="levels" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-3">
                {levels.map((level, i) => {
                  const isOpen = selectedLevel === i;
                  return (
                    <div key={i} className="rounded-xl overflow-hidden cursor-pointer"
                      style={{
                        border: isOpen ? `1.5px solid ${level.color}` : D ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb',
                        boxShadow: isOpen ? `0 0 18px ${level.color}28` : D ? '0 2px 8px rgba(0,0,0,0.6)' : '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                      onClick={() => setSelectedLevel(isOpen ? null : i)}>
                      <div className="p-3 sm:p-4" style={panelSt}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ backgroundColor: level.color + '22' }}>{level.icon}</div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm truncate" style={HT}>{level.level}</h4>
                              <div className="flex gap-2 items-center">
                                <p className="text-xs" style={ST}>{level.organisms?.length || 0} species</p>
                                {i > 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: level.color + '18', color: level.color }}>-{level.lossPercentage.toFixed(0)}%</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right">
                              <div className="font-mono font-bold text-sm" style={HT}>{level.biomass.toFixed(1)} kg</div>
                              <div className="text-xs" style={ST}>{((level.biomass / producerBiomass) * 100).toFixed(3)}%</div>
                            </div>
                            <ChevronDown size={16} style={{ color: D ? '#6b7280' : '#9ca3af', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
                          </div>
                        </div>
                        <div className="mt-3 h-2 rounded-full overflow-hidden" style={trackSt}>
                          <motion.div className="h-full rounded-full" style={{ backgroundColor: level.color }}
                            initial={{ width: 0 }} animate={{ width: `${Math.max(0.5, (level.biomass / producerBiomass) * 100)}%` }} transition={{ duration: 0.5 }}/>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="border-t overflow-hidden" style={borderSt}>
                            <div className="p-3 sm:p-4 space-y-3">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  { label: 'Population', val: level.totalPopulation?.toLocaleString() || '0',        clr: '#22c55e' },
                                  { label: 'Energy/kg',  val: `${level.energyPerKg?.toFixed(2) || '0'} kcal`,        clr: '#eab308' },
                                  { label: 'Efficiency', val: `${level.ecologicalEfficiency?.toFixed(1) || '100'}%`,  clr: '#3b82f6' },
                                  { label: 'Loss',       val: `${level.lossAmount?.toFixed(1) || '0'} kg`,           clr: '#ef4444' },
                                ].map((s, j) => (
                                  <div key={j} className="p-2 rounded-lg text-center" style={innerSt}>
                                    <div className="text-xs mb-0.5" style={ST}>{s.label}</div>
                                    <div className="font-bold text-xs sm:text-sm" style={{ color: s.clr }}>{s.val}</div>
                                  </div>
                                ))}
                              </div>
                              {level.organisms?.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-semibold mb-1" style={LT}>Species:</h5>
                                  <div className="space-y-1 max-h-28 overflow-y-auto">
                                    {level.organisms.map((org, j) => (
                                      <div key={j} className="flex items-center justify-between text-xs p-1.5 rounded" style={innerSt}>
                                        <div className="flex items-center gap-1.5">
                                          <span>{ORG_ICONS[org.name] || '🔹'}</span>
                                          <span style={LT}>{org.name}</span>
                                        </div>
                                        <span className="font-mono text-green-500 font-bold">{org.population?.toLocaleString() || '0'}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {i > 0 && (
                                <div className="p-3 rounded-lg"
                                  style={{ backgroundColor: D ? 'rgba(239,68,68,0.07)' : '#fef2f2', border: D ? '1px solid rgba(239,68,68,0.18)' : '1px solid #fecaca' }}>
                                  <p className="text-xs text-red-500 font-semibold mb-1">Loss: {level.lossAmount?.toFixed(1)} kg ({level.lossPercentage?.toFixed(0)}%)</p>
                                  <div className="h-1.5 rounded-full overflow-hidden" style={trackSt}>
                                    <motion.div className="h-full bg-red-500" initial={{ width: 0 }} animate={{ width: `${level.lossPercentage || 0}%` }}/>
                                  </div>
                                </div>
                              )}
                              <div className="p-2.5 rounded-lg text-xs" style={innerSt}>
                                <span className="font-semibold">📚 </span><span style={LT}>{level.fact}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* CARBON TAB */}
            {activeTab === 'carbon' && (
              <motion.div key="carbon" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                <div className="p-4 rounded-xl"
                  style={{ backgroundColor: D ? 'rgba(34,197,94,0.05)' : '#f0fdf4', border: D ? '1px solid rgba(34,197,94,0.2)' : '1px solid #bbf7d0' }}>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-1.5 text-green-500">🌱 Carbon Cycle</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Sequestered', val: `${carbon.sequestration} kg C`,  clr: '#22c55e', icon: '🌿' },
                      { label: 'Released',    val: `${carbon.release} kg C`,         clr: '#ef4444', icon: '💨' },
                      { label: 'Net Carbon',  val: `${(Number(carbon.sequestration) - Number(carbon.release)).toFixed(1)} kg C`, clr: '#3b82f6', icon: '⚖️' },
                      { label: 'CO₂ Equiv.',  val: `${(Number(carbon.sequestration) * 3.67).toFixed(0)} kg`, clr: '#a855f7', icon: '🏭' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 rounded-xl" style={innerSt}>
                        <div className="text-xl mb-1">{s.icon}</div>
                        <div className="text-xs mb-0.5" style={ST}>{s.label}</div>
                        <div className="font-bold text-sm" style={{ color: s.clr }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={panelSt}>
                  <div className="flex items-start gap-2">
                    {healthScore >= 60
                      ? <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0"/>
                      : <AlertTriangle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0"/>}
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: D ? '#60a5fa' : '#1d4ed8' }}>
                        Sustainability: {health.label}
                      </p>
                      <p className="text-xs" style={{ color: D ? '#93c5fd' : '#1e40af' }}>
                        {healthScore >= 60
                          ? `Ecosystem is healthy at ${efficiency}% efficiency.`
                          : `Low efficiency (${efficiency}%) limits energy for higher trophic levels.`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold" style={LT}>Recent Calculations</h4>
                  <button onClick={() => setHistory([])} className="text-xs flex items-center gap-1" style={{ color: '#ef4444' }}>
                    <RefreshCcw size={11}/> Clear
                  </button>
                </div>
                {history.length === 0
                  ? <p className="text-center text-sm py-4" style={ST}>Adjust sliders to record.</p>
                  : history.map((c, idx) => (
                    <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="p-3 rounded-xl cursor-pointer hover:opacity-90"
                      style={{ ...panelSt, border: D ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e5e7eb' }}
                      onClick={() => { setProducerBiomass(c.producerBiomass); setEfficiency(c.efficiency); }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono" style={ST}>{c.time}</span>
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: getHealthLabel(Number(c.healthScore)).color + '20', color: getHealthLabel(Number(c.healthScore)).color }}>
                          {getHealthLabel(Number(c.healthScore)).icon} {c.healthScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span style={ST}>Biomass: </span><span className="font-mono" style={HT}>{c.producerBiomass.toLocaleString()} kg</span></div>
                        <div><span style={ST}>Eff: </span><span className="font-mono text-blue-500">{c.efficiency}%</span></div>
                        <div><span style={ST}>Pop: </span><span className="font-mono text-green-500">{c.totals.population.toLocaleString()}</span></div>
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>↩ Click to restore</p>
                    </motion.div>
                  ))
                }
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── FOOTER ─────────────────────────────────────────────────── */}
          <div className="flex gap-2 pt-1">
            <button onClick={() => { setProducerBiomass(5000); setEfficiency(10); setCalcMode('standard'); }}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
              style={{ ...panelSt, border: D ? '1px solid rgba(255,255,255,0.10)' : '1px solid #e5e7eb', ...LT }}>
              <RefreshCcw size={14}/> Reset
            </button>
            <button onClick={handleExport}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-1.5 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)' }}>
              <Download size={14}/> Export Report
            </button>
          </div>

          <button onClick={() => setShowTips(!showTips)}
            className="w-full text-xs text-left flex items-center gap-1.5 py-1" style={ST}>
            <Info size={12}/>
            {showTips ? 'Hide' : 'Show'} ecology tips
            <ChevronDown size={11} style={{ transform: showTips ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
          </button>
          <AnimatePresence>
            {showTips && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="rounded-xl overflow-hidden" style={innerSt}>
                <div className="p-3 space-y-1.5 text-xs" style={ST}>
                  {[
                    '🌿 ~10% of energy transfers between each trophic level.',
                    '🦈 Apex predators need huge producer populations.',
                    '🌊 Marine ecosystems: 15–20% efficiency.',
                    '🔥 Respiration = ~60% of energy loss.',
                    '🍄 Decomposers recycle nutrients (not shown in standard pyramids).',
                    '📉 Shorter food chains (3 levels) are more efficient.',
                  ].map((tip, i) => <p key={i}>{tip}</p>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default BiomassCalculator;