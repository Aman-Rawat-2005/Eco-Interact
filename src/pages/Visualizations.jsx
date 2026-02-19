import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, ScatterChart, Scatter, ZAxis,
  ReferenceLine, Brush
} from 'recharts';

import { useDarkMode } from '../App';
import { useAuth } from '../context/AuthContext';
import { Crown, Sparkles, Lock } from 'lucide-react';

import {
  ECOSYSTEM_IMAGES,
  BIOME_IMAGES,
  BIOME_ECOSYSTEM_IMAGES,
  API_CONFIG,
  ECOLOGICAL_MODELS,
  ECOLOGICAL_LEVELS,
  BIOMES,
  SPECIES_DATA,
  BIOME_SPECIES,
  FLOWCHART_DATA,
  FALLBACK_IMAGE
} from '../data/visualizationData';

// ==================== FONT LOADER ====================
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
    .vis-root * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    .vis-mono { font-family: 'DM Mono', 'Fira Code', monospace !important; }
  `}</style>
);

// ==================== COLOR TOKENS ====================
const C = (dark) => ({
  pageBg:       dark ? '#0d1117' : '#f4f6f9',
  cardBg:       dark ? '#161b22' : '#ffffff',
  cardBgAlt:    dark ? '#1a2230' : '#f8fafc',
  cardBorder:   dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)',
  textPrimary:  dark ? '#e6edf3' : '#1a202c',
  textSecondary:dark ? '#8b949e' : '#6b7280',
  textMuted:    dark ? '#484f58' : '#9ca3af',
  inputBg:      dark ? '#21262d' : '#f1f5f9',
  sliderTrack:  dark ? '#30363d' : '#e2e8f0',
  green:        '#10b981',
  greenDark:    '#059669',
  amber:        '#f59e0b',
  red:          '#ef4444',
  blue:         '#3b82f6',
  purple:       '#8b5cf6',
  orange:       '#fb923c',
  lime:         '#84cc16',
  sectionBorder:dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
  chartGrid:    dark ? '#21262d' : '#f1f5f9',
  chartAxis:    dark ? '#6e7681' : '#94a3b8',
  heroBg:       dark ? 'linear-gradient(135deg,#0b1a0f,#0f2318)' : 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
  heroBorder:   dark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.25)',
  ecoBg:        dark ? '#0d1117' : '#f8fafc',
  ecoBorder:    dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
  predBg:       dark ? '#0d1117' : '#faf5ff',
  predBorder:   dark ? 'rgba(139,92,246,0.18)' : 'rgba(139,92,246,0.18)',
  speedBg:      dark ? '#0d1117' : '#fffbeb',
  speedBorder:  dark ? 'rgba(245,158,11,0.18)' : 'rgba(245,158,11,0.2)',
  toggleActive: dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.07)',
  toggleActiveBorder: dark ? 'rgba(16,185,129,0.28)' : 'rgba(16,185,129,0.28)',
  statusBg:     dark ? '#161b22' : '#ffffff',
  statusBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
  flowBorder:   (accent) => `${accent}22`,
  speedInactive:dark ? '#21262d' : '#e2e8f0',
  speedInactiveTxt: dark ? '#6e7681' : '#64748b',
  actionSecBg:  dark ? '#21262d' : '#f1f5f9',
  actionSecBorder: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
  actionSecTxt: dark ? '#8b949e' : '#475569',
  emptyTxt:     dark ? '#484f58' : '#94a3b8',
  simBtnDisabledBg: dark ? '#21262d' : '#e2e8f0',
  simBtnDisabledTxt: dark ? '#484f58' : '#94a3b8',
});

// ==================== CUSTOM IMAGE ====================
const EcoImage = ({ src, alt, className, fallback = FALLBACK_IMAGE }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { setImgSrc(src || fallback); setLoading(true); setError(false); }, [src, fallback]);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(127,127,127,0.15)' }} />}
      <img src={imgSrc} alt={alt || 'Ecosystem'} className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectPosition: 'center center' }}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setImgSrc(fallback); setLoading(false); }} />
      {error && <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(127,127,127,0.1)' }}><span className="text-xs" style={{ color: '#94a3b8' }}>⚠</span></div>}
    </div>
  );
};

// ==================== BIOME FLOWCHART CONFIG ====================
const BIOME_FLOWCHART_MAP = {
  tropical:  { title: 'Tropical Rainforest Food Web',   desc: 'Rich, complex food chain with maximum biodiversity and energy transfer',    components: ['producer','primary','secondary','tertiary','decomposer'], type: 'linear',  accent: '#10b981', heroBg: ['#052e16','#064e3b'] },
  temperate: { title: 'Temperate Forest Energy Flow',   desc: 'Seasonal food web with diverse trophic levels and moderate biodiversity',   components: ['producer','primary','secondary','tertiary','decomposer'], type: 'pyramid', accent: '#f59e0b', heroBg: ['#451a03','#78350f'] },
  boreal:    { title: 'Boreal Forest Nutrient Cycle',   desc: 'Cold forest ecosystem with slow decomposition and cyclic nutrient flow',    components: ['producer','primary','secondary','tertiary','decomposer'], type: 'cyclic',  accent: '#38bdf8', heroBg: ['#082f49','#0c4a6e'] },
  grassland: { title: 'Grassland Biomass Distribution', desc: 'Open savanna ecosystem with herbivore-dominated energy flow',               components: ['producer','primary','secondary','tertiary','decomposer'], type: 'flow',    accent: '#84cc16', heroBg: ['#1a2e05','#2d4a0f'] },
  desert:    { title: 'Desert Survival Chain',          desc: 'Minimal, highly efficient food web adapted to extreme arid conditions',     components: ['producer','primary','secondary','tertiary','decomposer'], type: 'linear',  accent: '#fb923c', heroBg: ['#431407','#7c2d12'] },
  tundra:    { title: 'Tundra Energy Pyramid',          desc: 'Sparse Arctic ecosystem with short, intense seasonal energy transfer',      components: ['producer','primary','secondary','tertiary','decomposer'], type: 'pyramid', accent: '#7dd3fc', heroBg: ['#082f49','#0c4a6e'] },
};
const LEVEL_KEY_MAP = { producer: 'producers', primary: 'primary', secondary: 'secondary', tertiary: 'tertiary', decomposer: 'decomposer' };

// ==================== TOOLTIP / AXIS HELPERS ====================
const mkTooltip = (c) => ({
  backgroundColor: c.cardBg,
  borderColor: c.cardBorder,
  borderWidth: 1,
  borderRadius: 10,
  color: c.textPrimary,
  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
});
const mkAxis = (c) => ({ stroke: c.chartAxis, fontSize: 11, fontFamily: 'Inter, sans-serif' });
const mkGrid = (c) => ({ strokeDasharray: '4 4', stroke: c.chartGrid });
const mkLegend = () => ({ fontSize: 11, fontFamily: 'Inter, sans-serif' });

// ==================== SECTION HEADER ====================
const SectionHeader = ({ title, subtitle, accent = '#10b981' }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-0.5">
      <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: accent }} />
      <h4 className="text-sm font-semibold tracking-wide" style={{ color: 'inherit' }}>{title}</h4>
    </div>
    {subtitle && <p className="text-xs pl-3" style={{ color: 'inherit', opacity: 0.55 }}>{subtitle}</p>}
  </div>
);

// ==================== PRO SLIDER ====================
const ProSlider = ({ label, value, min, max, step, onChange, unit, color = '#10b981', c }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="p-4 rounded-xl border transition-all duration-200"
      style={{ background: `${color}08`, borderColor: `${color}20` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: c.textSecondary }}>{label}</span>
        <span className="vis-mono text-xs font-semibold px-2.5 py-0.5 rounded-md"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-visible" style={{ background: c.sliderTrack }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color}70,${color})` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white shadow transition-all duration-100"
          style={{ left: `calc(${pct}% - 7px)`, borderColor: color, boxShadow: `0 0 0 3px ${color}20` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
    </div>
  );
};

// ==================== PRO TOGGLE ====================
const ProToggle = ({ label, description, value, onChange, c }) => (
  <button
    className="w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200"
    style={{ background: value ? c.toggleActive : 'transparent', borderColor: value ? c.toggleActiveBorder : c.cardBorder }}
    onClick={() => onChange(!value)}
  >
    <div>
      <p className="text-sm font-medium" style={{ color: c.textPrimary }}>{label}</p>
      {description && <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{description}</p>}
    </div>
    <div className="relative flex-shrink-0 ml-4 w-10 h-5 rounded-full transition-colors duration-200"
      style={{ background: value ? '#10b981' : c.sliderTrack }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: value ? '22px' : '2px', boxShadow: value ? '0 0 6px rgba(16,185,129,0.5)' : 'none' }} />
    </div>
  </button>
);

// ==================== STAT CARD ====================
const StatCard = ({ label, value, unit, color, c }) => (
  <div className="p-4 rounded-xl text-center" style={{ background: `${color}10`, border: `1px solid ${color}22` }}>
    <div className="vis-mono text-xl font-bold" style={{ color }}>
      {value}<span className="text-xs font-normal ml-1" style={{ color: c.textMuted }}>{unit}</span>
    </div>
    <div className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: c.textSecondary }}>{label}</div>
  </div>
);

// ==================== CARD WRAPPER ====================
const Card = ({ children, className = '', c, style = {} }) => (
  <div className={`p-6 rounded-2xl border ${className}`}
    style={{ background: c.cardBg, borderColor: c.cardBorder, ...style }}>
    {children}
  </div>
);

// ==================== MAIN COMPONENT ====================
const EcosystemVisualization = () => {
  const { darkMode } = useDarkMode();
  const { isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  const c = C(darkMode);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBiome, setSelectedBiome] = useState('tropical');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [timeScale] = useState('day');
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationData, setSimulationData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [apiData, setApiData] = useState({ population: [], climate: [] });
  const [params, setParams] = useState({
    growthRate: 0.2, carryingCapacity: 1000, initialPopulation: 100,
    preyBirthRate: 0.1, preyDeathRate: 0.02, predatorBirthRate: 0.01, predatorDeathRate: 0.1,
    initialPrey: 500, initialPredator: 50,
    temperature: 25, rainfall: 100, pollution: 10,
    resources: 1000, co2Level: 400, speciesCount: 100, forestRatio: 0.4
  });

  const simInterval = useRef(null);
  const apiInterval = useRef(null);
  const containerRef = useRef(null);

  // Backend check
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('http://localhost:5000/api/health');
        setConnectionStatus(r.ok ? 'connected' : 'disconnected');
      } catch { setConnectionStatus('offline'); }
    })();
  }, []);

  // API — silent
  const fetchWorldBank = useCallback(async () => {
    try {
      const url = new URL(API_CONFIG.worldBank.url);
      Object.entries(API_CONFIG.worldBank.params).forEach(([k, v]) => url.searchParams.append(k, v));
      const json = await (await fetch(url.toString())).json();
      setApiData(p => ({ ...p, population: API_CONFIG.worldBank.transform(json) }));
      console.info('[API] World Bank loaded');
    } catch (e) { console.error('[API] World Bank:', e); }
  }, []);

  const fetchNASA = useCallback(async () => {
    try {
      const tUrl = new URL(API_CONFIG.nasa.temperature.url);
      const rUrl = new URL(API_CONFIG.nasa.rainfall.url);
      Object.entries(API_CONFIG.nasa.temperature.params).forEach(([k, v]) => tUrl.searchParams.append(k, v));
      Object.entries(API_CONFIG.nasa.rainfall.params).forEach(([k, v]) => rUrl.searchParams.append(k, v));
      const [tJ, rJ] = await Promise.all([(await fetch(tUrl.toString())).json(), (await fetch(rUrl.toString())).json()]);
      setApiData(p => ({ ...p, climate: API_CONFIG.nasa.transform(tJ, rJ) }));
      console.info('[API] NASA loaded');
    } catch (e) { console.error('[API] NASA:', e); }
  }, []);

  // Simulation
  useEffect(() => {
    if (!simulationRunning) return;
    simInterval.current = setInterval(() => {
      setSimulationTime(p => p + simulationSpeed);
      setSimulationData(prev => {
        const last = prev[prev.length - 1] || {
          time: 0, producers: params.initialPopulation, primary: params.initialPrey,
          secondary: params.initialPredator, tertiary: 8, decomposers: 500,
          temperature: params.temperature, rainfall: params.rainfall, co2: params.co2Level, biodiversity: 0.8
        };
        const newP = ECOLOGICAL_MODELS.logisticGrowth(last.producers, params.growthRate, params.carryingCapacity, last.temperature, last.rainfall, params.pollution);
        const [newPr, newSe] = ECOLOGICAL_MODELS.predatorPrey(last.primary, last.secondary, params.preyBirthRate, params.preyDeathRate, params.predatorBirthRate, params.predatorDeathRate);
        return [...prev, {
          time: last.time + 1,
          producers: Math.max(0, newP),
          primary: Math.max(0, newPr),
          secondary: Math.max(0, newSe),
          tertiary: last.tertiary, decomposers: last.decomposers,
          temperature: params.temperature + Math.sin(prev.length * 0.1) * 2,
          rainfall: Math.max(0, params.rainfall + Math.cos(prev.length * 0.05) * 10),
          co2: last.co2,
          biodiversity: ECOLOGICAL_MODELS.biodiversityIndex(Math.min(100, last.producers / 100))
        }].slice(-200);
      });
    }, 1000 / simulationSpeed);
    return () => clearInterval(simInterval.current);
  }, [simulationRunning, simulationSpeed, params]);

  useEffect(() => {
    if (!simulationData.length) { setProcessedData([]); return; }
    setProcessedData(simulationData.map(d => ({
      ...d,
      totalBiomass: d.producers + d.primary + d.secondary + d.tertiary + d.decomposers,
      energyFlow: d.producers * 0.1,
      trophicEfficiency: (d.primary / d.producers * 100) || 0,
      stability: ECOLOGICAL_MODELS.stabilityIndex([d])
    })));
  }, [simulationData]);

  useEffect(() => {
    fetchWorldBank(); fetchNASA();
    apiInterval.current = setInterval(() => { fetchWorldBank(); fetchNASA(); setLastUpdate(new Date()); }, 30000);
    return () => clearInterval(apiInterval.current);
  }, [fetchWorldBank, fetchNASA]);

  const aggregatedStats = useMemo(() => {
    if (!processedData.length) return null;
    return { current: processedData[processedData.length - 1], stability: ECOLOGICAL_MODELS.stabilityIndex(processedData) };
  }, [processedData]);

  // Handlers
  const handleStart  = () => { setSimulationRunning(true);  console.info('[SIM] Started'); };
  const handlePause  = () => { setSimulationRunning(false); console.info('[SIM] Paused'); };
  const handleReset  = () => { setSimulationRunning(false); setSimulationData([]); setSimulationTime(0); console.info('[SIM] Reset'); };
  const handleExport = () => {
    const a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(processedData, null, 2));
    a.download = `ecosystem-${new Date().toISOString()}.json`;
    a.click();
  };
  const toggleFS = () => {
    if (!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  // ==================== OVERVIEW ====================
  const renderFlowchart = () => {
    const bf = BIOME_FLOWCHART_MAP[selectedBiome];
    const bi = BIOME_ECOSYSTEM_IMAGES?.[selectedBiome] || {};
    const comps = bf.components.map(id => ECOLOGICAL_LEVELS.find(l => l.id === id)).filter(Boolean);
    return (
      <div className="p-6 rounded-2xl border transition-all duration-500"
        style={{ background: darkMode ? `linear-gradient(135deg,${bf.heroBg[0]},${bf.heroBg[1]})` : `linear-gradient(135deg,${bf.accent}10,${bf.accent}05)`, borderColor: `${bf.accent}25` }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: bf.accent }} />
          <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#ffffff' : bf.accent }}>{bf.title}</h3>
        </div>
        <p className="text-sm mb-7 pl-3.5" style={{ color: darkMode ? 'rgba(255,255,255,0.55)' : c.textSecondary }}>{bf.desc}</p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
          {comps.map((comp, idx) => {
            const imgSrc = bi[LEVEL_KEY_MAP[comp.id]]?.thumbnail;
            return (
              <React.Fragment key={comp.id}>
                <button onClick={() => setSelectedComponent({ ...comp, biome: selectedBiome })}
                  className="group relative w-36 h-36 rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ border: `2px solid ${bf.accent}35` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = bf.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${bf.accent}35`}>
                  <EcoImage src={imgSrc} alt={comp.name} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                    <span className="font-semibold text-xs leading-tight" style={{ color: '#ffffff' }}>{comp.name}</span>
                  </div>
                </button>
                {idx < comps.length - 1 && (
                  <span className="text-2xl font-bold select-none flex-shrink-0" style={{ color: bf.accent }}>→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBiomeSelector = () => (
    <Card c={c}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: '#10b981' }} />
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: c.textPrimary }}>Select Biome</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {BIOMES.map(biome => {
          const bf = BIOME_FLOWCHART_MAP[biome.id];
          const selected = selectedBiome === biome.id;
          return (
            <button key={biome.id} onClick={() => setSelectedBiome(biome.id)}
              className="relative h-24 rounded-xl overflow-hidden border-2 transition-all duration-200"
              style={{ borderColor: selected ? bf.accent : 'transparent', transform: selected ? 'scale(1.04)' : 'scale(1)', boxShadow: selected ? `0 0 0 3px ${bf.accent}30` : 'none' }}>
              <EcoImage src={biome.image?.thumbnail} alt={biome.name} className="w-full h-full" />
              <div className="absolute inset-0" style={{ background: selected ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-semibold text-xs text-center px-1 leading-tight" style={{ color: '#ffffff' }}>{biome.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );

  // ==================== TABS ====================
  const TABS = [
    { id: 'overview',   label: 'Overview' },
    { id: 'data',       label: 'Data' },
    { id: 'control',    label: 'Control' },
    { id: 'simulation', label: 'Simulation' },
  ];

  // ==================== RENDER LOCKED TAB ====================
  const renderLockedTab = (message, isLoginLock = false) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-md w-full p-8 rounded-2xl" style={{ backgroundColor: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isLoginLock ? '' : 'bg-opacity-15'}`} 
          style={{ backgroundColor: isLoginLock ? c.inputBg : 'rgba(234,179,8,0.15)' }}>
          {isLoginLock ? (
            <Lock className="w-8 h-8" style={{ color: c.textSecondary }} />
          ) : (
            <Crown className="w-8 h-8 text-yellow-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: c.textPrimary }}>
          {isLoginLock ? 'Login Required' : 'Premium Feature'}
        </h2>
        <p className="text-sm mb-6" style={{ color: c.textSecondary }}>{message}</p>
        <button
          onClick={() => navigate(isLoginLock ? "/login" : "/premium")}
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

  // ==================== RENDER TAB CONTENT ====================
  const renderTabContent = () => {
    // Overview tab - हमेशा दिखेगा (बिना किसी lock के)
    if (activeTab === 'overview') {
      return <>{renderFlowchart()}{renderBiomeSelector()}</>;
    }

    // Data, Control, Simulation tabs - ये सब premium चाहिए
    if (!isAuthenticated) {
      return renderLockedTab("Please login to access ecosystem data and simulations.", true);
    }

    if (!isPremium) {
      return renderLockedTab("Upgrade to premium to access ecosystem data, control panel, and advanced simulations.", false);
    }

    // Premium user - अब ही ये tabs दिखेंगे
    switch(activeTab) {
      case 'data':
        return (
          <div className="space-y-6">
            {!apiData.population.length && !apiData.climate.length && (
              <Card c={c} className="text-center">
                <p className="text-sm" style={{ color: c.textSecondary }}>Fetching data from World Bank &amp; NASA…</p>
              </Card>
            )}
            {apiData.population.length > 0 && (
              <Card c={c}>
                <SectionHeader title="Population Trend (World Bank)" subtitle="India — annual population 2000–2023" accent="#10b981" />
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={apiData.population}>
                    {showGrid && <CartesianGrid {...mkGrid(c)} />}
                    <XAxis dataKey="year" {...mkAxis(c)} />
                    <YAxis {...mkAxis(c)} tickFormatter={v => `${(v/1e9).toFixed(1)}B`} />
                    <Tooltip contentStyle={mkTooltip(c)} formatter={v => [`${(v/1e6).toFixed(1)}M`,'Population']} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
            {apiData.climate.length > 0 && (
              <Card c={c}>
                <SectionHeader title="Climate Data (NASA POWER)" subtitle="Monthly temperature &amp; rainfall — New Delhi 2020–2024" accent="#3b82f6" />
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={apiData.climate}>
                    {showGrid && <CartesianGrid {...mkGrid(c)} />}
                    <XAxis dataKey="month" {...mkAxis(c)} tickFormatter={v => `M${v}`} />
                    <YAxis yAxisId="l" {...mkAxis(c)} />
                    <YAxis yAxisId="r" orientation="right" {...mkAxis(c)} />
                    <Tooltip contentStyle={mkTooltip(c)} />
                    {showLegend && <Legend wrapperStyle={mkLegend()} />}
                    <Bar yAxisId="l" dataKey="temperature" fill="#ef4444" fillOpacity={0.75} radius={[4,4,0,0]} name="Temp (°C)" />
                    <Line yAxisId="r" type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} dot={false} name="Rainfall (mm)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        );
      case 'control':
        return (
          <div className="space-y-5">
            {/* Hero */}
            <div className="relative p-7 rounded-2xl overflow-hidden"
              style={{ background: c.heroBg, border: `1px solid ${c.heroBorder}` }}>
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.12),transparent)', filter: 'blur(24px)' }} />
              <div className="relative z-10">
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#10b981' }}>Simulation Engine</p>
                <h3 className="text-2xl font-bold mb-1"
                  style={{ background: 'linear-gradient(120deg,#10b981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Control Panel
                </h3>
                <p className="text-xs font-medium mb-7" style={{ color: darkMode ? 'rgba(255,255,255,0.45)' : '#6b7280' }}>
                  Manage ecosystem simulation parameters and live data feeds
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Start', icon: '▶', disabled: simulationRunning,  onClick: handleStart,
                      style: simulationRunning
                        ? { background: c.simBtnDisabledBg, border: `1px solid ${c.cardBorder}`, opacity: 0.45, cursor: 'not-allowed' }
                        : { background: 'linear-gradient(135deg,#059669,#10b981)', border: '1px solid rgba(52,211,153,0.4)', boxShadow: '0 0 22px rgba(16,185,129,0.22)', cursor: 'pointer' }
                    },
                    { label: 'Pause', icon: '⏸', disabled: !simulationRunning, onClick: handlePause,
                      style: !simulationRunning
                        ? { background: c.simBtnDisabledBg, border: `1px solid ${c.cardBorder}`, opacity: 0.45, cursor: 'not-allowed' }
                        : { background: 'linear-gradient(135deg,#b45309,#d97706)', border: '1px solid rgba(251,191,36,0.4)', boxShadow: '0 0 22px rgba(217,119,6,0.22)', cursor: 'pointer' }
                    },
                    { label: 'Reset', icon: '↺', disabled: false, onClick: handleReset,
                      style: { background: c.actionSecBg, border: `1px solid ${c.actionSecBorder}`, cursor: 'pointer' }
                    }
                  ].map(btn => (
                    <button key={btn.label} disabled={btn.disabled} onClick={btn.onClick}
                      className="flex flex-col items-center justify-center gap-1.5 py-5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      style={btn.style}>
                      <span className="text-2xl leading-none" style={{ color: '#ffffff' }}>{btn.icon}</span>
                      <span className="text-xs font-semibold tracking-wider" style={{ color: '#ffffff' }}>{btn.label.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Sim Time"    value={simulationTime} unit={`${timeScale}s`} color="#10b981" c={c} />
              <StatCard label="Data Points" value={processedData.length} unit="pts" color="#3b82f6" c={c} />
              <StatCard label="Stability"   value={((aggregatedStats?.stability || 0)*100).toFixed(0)} unit="%"
                color={(aggregatedStats?.stability||0) > 0.7 ? '#10b981' : (aggregatedStats?.stability||0) > 0.4 ? '#f59e0b' : '#ef4444'} c={c} />
            </div>

            {/* Ecological params */}
            <div className="p-5 rounded-2xl" style={{ background: c.ecoBg, border: `1px solid ${c.ecoBorder}` }}>
              <div style={{ color: c.textPrimary }}><SectionHeader title="Ecological Parameters" subtitle="Population growth and environmental variables" accent="#10b981" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ProSlider label="Growth Rate"  value={params.growthRate}  min={0}   max={0.5} step={0.01} onChange={v => setParams(p=>({...p,growthRate:v}))}  unit=""   color="#10b981" c={c} />
                <ProSlider label="Temperature"  value={params.temperature} min={-10} max={50}  step={1}    onChange={v => setParams(p=>({...p,temperature:v}))} unit="°C" color="#ef4444" c={c} />
                <ProSlider label="Rainfall"     value={params.rainfall}    min={0}   max={500} step={10}   onChange={v => setParams(p=>({...p,rainfall:v}))}    unit="mm" color="#3b82f6" c={c} />
                <ProSlider label="Pollution"    value={params.pollution}   min={0}   max={100} step={1}    onChange={v => setParams(p=>({...p,pollution:v}))}   unit=""   color="#fb923c" c={c} />
              </div>
            </div>

            {/* Predator-Prey */}
            <div className="p-5 rounded-2xl" style={{ background: c.predBg, border: `1px solid ${c.predBorder}` }}>
              <div style={{ color: c.textPrimary }}><SectionHeader title="Predator-Prey Dynamics" subtitle="Lotka-Volterra equation parameters" accent="#8b5cf6" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ProSlider label="Prey Birth Rate"     value={params.preyBirthRate}     min={0} max={0.5}  step={0.01}  onChange={v=>setParams(p=>({...p,preyBirthRate:v}))}     unit="" color="#84cc16" c={c} />
                <ProSlider label="Prey Death Rate"     value={params.preyDeathRate}     min={0} max={0.2}  step={0.005} onChange={v=>setParams(p=>({...p,preyDeathRate:v}))}     unit="" color="#f59e0b" c={c} />
                <ProSlider label="Predator Birth Rate" value={params.predatorBirthRate} min={0} max={0.1}  step={0.001} onChange={v=>setParams(p=>({...p,predatorBirthRate:v}))} unit="" color="#8b5cf6" c={c} />
                <ProSlider label="Predator Death Rate" value={params.predatorDeathRate} min={0} max={0.5}  step={0.01}  onChange={v=>setParams(p=>({...p,predatorDeathRate:v}))} unit="" color="#ef4444" c={c} />
              </div>
            </div>

            {/* Speed + Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl" style={{ background: c.speedBg, border: `1px solid ${c.speedBorder}` }}>
                <div style={{ color: c.textPrimary }}><SectionHeader title="Simulation Speed" subtitle="Time steps per second" accent="#f59e0b" /></div>
                <div className="flex gap-2">
                  {[0.5, 1, 2, 5, 10].map(spd => (
                    <button key={spd} onClick={() => setSimulationSpeed(spd)}
                      className="flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 hover:scale-105"
                      style={simulationSpeed === spd ? {
                        background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                        color: '#ffffff',
                        boxShadow: '0 0 14px rgba(245,158,11,0.35)',
                        border: '1px solid rgba(251,191,36,0.4)'
                      } : {
                        background: c.speedInactive,
                        border: `1px solid ${c.cardBorder}`,
                        color: c.speedInactiveTxt
                      }}>
                      {spd}×
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: c.ecoBg, border: `1px solid ${c.ecoBorder}` }}>
                <div style={{ color: c.textPrimary }}><SectionHeader title="Display Settings" subtitle="Chart visualization options" accent="#6366f1" /></div>
                <div className="space-y-2.5">
                  <ProToggle label="Show Grid Lines"  description="Render reference grid on charts" value={showGrid}   onChange={setShowGrid}   c={c} />
                  <ProToggle label="Show Legend"      description="Display data series labels"      value={showLegend} onChange={setShowLegend} c={c} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleExport}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.28)', color: '#3b82f6' }}>
                ↓ Export JSON
                <span className="vis-mono text-xs ml-1" style={{ color: '#3b82f680' }}>({processedData.length} pts)</span>
              </button>
              <button onClick={toggleFS}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: c.actionSecBg, border: `1px solid ${c.actionSecBorder}`, color: c.actionSecTxt }}>
                ⛶ {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        );
      case 'simulation':
        return (
          <div className="space-y-6">
            {!processedData.length ? (
              <Card c={c} className="text-center">
                <div className="py-10">
                  <div className="text-5xl mb-4" style={{ opacity: 0.22 }}>⚡</div>
                  <p className="font-medium text-sm" style={{ color: c.textSecondary }}>Simulation not running</p>
                  <p className="text-xs mt-1" style={{ color: c.textMuted }}>Go to the Control tab and press Start</p>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard label="Producers"  value={processedData[processedData.length-1]?.producers?.toFixed(0)||0}  unit="" color="#10b981" c={c} />
                  <StatCard label="Primary"    value={processedData[processedData.length-1]?.primary?.toFixed(0)||0}    unit="" color="#f59e0b" c={c} />
                  <StatCard label="Secondary"  value={processedData[processedData.length-1]?.secondary?.toFixed(0)||0}  unit="" color="#ef4444" c={c} />
                  <StatCard label="Biodiversity" value={((processedData[processedData.length-1]?.biodiversity||0)*100).toFixed(1)} unit="%" color="#8b5cf6" c={c} />
                </div>
                <Card c={c}>
                  <SectionHeader title="Live Simulation Feed" subtitle="Real-time population and biodiversity tracking" accent="#10b981" />
                  <ResponsiveContainer width="100%" height={340}>
                    <ComposedChart data={processedData.slice(-100)}>
                      {showGrid && <CartesianGrid {...mkGrid(c)} />}
                      <XAxis dataKey="time" {...mkAxis(c)} tickFormatter={v => `T${v}`} />
                      <YAxis yAxisId="l" {...mkAxis(c)} />
                      <YAxis yAxisId="r" orientation="right" {...mkAxis(c)} domain={[0,1]} />
                      <Tooltip contentStyle={mkTooltip(c)} />
                      {showLegend && <Legend wrapperStyle={mkLegend()} />}
                      <Brush dataKey="time" height={16} stroke={c.cardBorder} fill={c.cardBgAlt} travellerWidth={6} />
                      <Area yAxisId="l" type="monotone" dataKey="producers" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.35} name="Producers" />
                      <Area yAxisId="l" type="monotone" dataKey="primary"   stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} name="Primary" />
                      <Area yAxisId="l" type="monotone" dataKey="secondary" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.35} name="Secondary" />
                      <Line yAxisId="r" type="monotone" dataKey="biodiversity" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Biodiversity" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Card>
                {renderCharts()}
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // ==================== RENDER CHARTS (helper for simulation) ====================
  const renderCharts = () => {
    const trophicData = [
      { level: 'Producers', energy: 10000, biomass: 8200 },
      { level: 'Primary',   energy: 1000,  biomass: 820  },
      { level: 'Secondary', energy: 100,   biomass: 82   },
      { level: 'Tertiary',  energy: 10,    biomass: 8.2  },
      { level: 'Decomposers',energy: 500,  biomass: 410  },
    ];
    const biomeRadar = [
      { subject: 'Species Richness', tropical: 95, temperate: 62, desert: 18, tundra: 22 },
      { subject: 'Biomass',          tropical: 88, temperate: 70, desert: 12, tundra: 18 },
      { subject: 'Stability',        tropical: 80, temperate: 74, desert: 52, tundra: 60 },
      { subject: 'Productivity',     tropical: 92, temperate: 65, desert: 15, tundra: 14 },
      { subject: 'Water Avail.',     tropical: 98, temperate: 72, desert:  5, tundra: 30 },
    ];
    const carbonData = Array.from({ length: 20 }, (_, i) => ({
      co2: 380 + i * 2.2 + Math.random() * 3, temp: 14.2 + i * 0.02 + Math.random() * 0.4, z: 50 + Math.random() * 40
    }));

    return (
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card c={c}>
            <SectionHeader title="Population Dynamics" subtitle="Stacked trophic populations over time" accent="#10b981" />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={processedData.slice(-80)}>
                {showGrid && <CartesianGrid {...mkGrid(c)} />}
                <XAxis dataKey="time" {...mkAxis(c)} tickFormatter={v => `T${v}`} />
                <YAxis {...mkAxis(c)} />
                <Tooltip contentStyle={mkTooltip(c)} />
                {showLegend && <Legend wrapperStyle={mkLegend()} />}
                <Brush dataKey="time" height={16} stroke={c.cardBorder} fill={c.cardBgAlt} travellerWidth={6} />
                <Area type="monotone" dataKey="producers" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.45} name="Producers" />
                <Area type="monotone" dataKey="primary"   stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.45} name="Primary" />
                <Area type="monotone" dataKey="secondary" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.45} name="Secondary" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card c={c}>
            <SectionHeader title="Trophic Energy Flow" subtitle="Energy (kJ/m²/yr) transferred between levels" accent="#f59e0b" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trophicData} layout="vertical" margin={{ left: 12 }}>
                {showGrid && <CartesianGrid {...mkGrid(c)} horizontal={false} />}
                <XAxis type="number" {...mkAxis(c)} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <YAxis type="category" dataKey="level" {...mkAxis(c)} width={82} />
                <Tooltip contentStyle={mkTooltip(c)} formatter={v => [`${v.toLocaleString()} kJ`, 'Energy']} />
                <Bar dataKey="energy" name="Energy" radius={[0, 5, 5, 0]}
                  fill="url(#energyGrad)">
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card c={c}>
            <SectionHeader title="Environmental Metrics" subtitle="Temperature · Rainfall · Biodiversity index" accent="#3b82f6" />
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={processedData.slice(-80)}>
                {showGrid && <CartesianGrid {...mkGrid(c)} />}
                <XAxis dataKey="time" {...mkAxis(c)} tickFormatter={v => `T${v}`} />
                <YAxis yAxisId="l" {...mkAxis(c)} />
                <YAxis yAxisId="r" orientation="right" {...mkAxis(c)} domain={[0, 1]} />
                <Tooltip contentStyle={mkTooltip(c)} />
                {showLegend && <Legend wrapperStyle={mkLegend()} />}
                <ReferenceLine yAxisId="l" y={params.temperature} stroke={`${c.chartAxis}60`} strokeDasharray="4 4" />
                <Line yAxisId="l" type="monotone" dataKey="temperature" stroke="#ef4444" dot={false} strokeWidth={2} name="Temp (°C)" />
                <Line yAxisId="r" type="monotone" dataKey="rainfall"    stroke="#3b82f6" dot={false} strokeWidth={2} name="Rainfall (mm)" />
                <Line yAxisId="r" type="monotone" dataKey="biodiversity" stroke="#10b981" dot={false} strokeWidth={1.5} strokeDasharray="5 3" name="Biodiversity" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card c={c}>
            <SectionHeader title="Biome Biodiversity Comparison" subtitle="Multi-axis ecological metrics across 4 biomes" accent="#8b5cf6" />
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart outerRadius={88} data={biomeRadar}>
                <PolarGrid stroke={c.chartGrid} />
                <PolarAngleAxis dataKey="subject" tick={{ ...mkAxis(c), fontSize: 10 }} />
                <PolarRadiusAxis stroke={c.chartGrid} tick={false} />
                <Radar name="Tropical"  dataKey="tropical"  stroke="#10b981" fill="#10b981" fillOpacity={0.13} strokeWidth={1.5} />
                <Radar name="Temperate" dataKey="temperate" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.13} strokeWidth={1.5} />
                <Radar name="Desert"    dataKey="desert"    stroke="#fb923c" fill="#fb923c" fillOpacity={0.13} strokeWidth={1.5} />
                <Radar name="Tundra"    dataKey="tundra"    stroke="#7dd3fc" fill="#7dd3fc" fillOpacity={0.13} strokeWidth={1.5} />
                {showLegend && <Legend wrapperStyle={mkLegend()} />}
                <Tooltip contentStyle={mkTooltip(c)} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card c={c}>
            <SectionHeader title="Biomass Distribution" subtitle="Energy vs Biomass per trophic level" accent="#f59e0b" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trophicData}>
                {showGrid && <CartesianGrid {...mkGrid(c)} />}
                <XAxis dataKey="level" {...mkAxis(c)} tick={{ ...mkAxis(c), fontSize: 9 }} />
                <YAxis {...mkAxis(c)} />
                <Tooltip contentStyle={mkTooltip(c)} />
                {showLegend && <Legend wrapperStyle={mkLegend()} />}
                <Bar dataKey="energy"  name="Energy (kJ)"   fill="#10b981" radius={[4,4,0,0]} fillOpacity={0.85} />
                <Bar dataKey="biomass" name="Biomass (g/m²)" fill="#3b82f6" radius={[4,4,0,0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card c={c}>
            <SectionHeader title="CO₂ vs Surface Temperature" subtitle="Correlation between atmospheric CO₂ and temperature" accent="#fb923c" />
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ right: 16 }}>
                {showGrid && <CartesianGrid {...mkGrid(c)} />}
                <XAxis dataKey="co2"  {...mkAxis(c)} name="CO₂ (ppm)" label={{ value: 'CO₂ (ppm)', position: 'insideBottom', offset: -2, fill: c.chartAxis, fontSize: 10 }} />
                <YAxis dataKey="temp" {...mkAxis(c)} name="Temp (°C)"  label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', offset: 6, fill: c.chartAxis, fontSize: 10 }} />
                <ZAxis dataKey="z" range={[30, 120]} />
                <Tooltip contentStyle={mkTooltip(c)} formatter={(v) => [typeof v === 'number' ? v.toFixed(2) : v]} />
                <Scatter name="Observation" data={carbonData} fill="#fb923c" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* API data rows */}
        {(apiData.population.length > 0 || apiData.climate.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiData.population.length > 0 && (
              <Card c={c}>
                <SectionHeader title="Population Trend" subtitle="World Bank — India (2000–2023)" accent="#10b981" />
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={apiData.population}>
                    {showGrid && <CartesianGrid {...mkGrid(c)} />}
                    <XAxis dataKey="year" {...mkAxis(c)} />
                    <YAxis {...mkAxis(c)} tickFormatter={v => `${(v/1e9).toFixed(1)}B`} />
                    <Tooltip contentStyle={mkTooltip(c)} formatter={v => [`${(v/1e6).toFixed(1)}M`,'Population']} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
            {apiData.climate.length > 0 && (
              <Card c={c}>
                <SectionHeader title="Climate Data" subtitle="NASA POWER — India 2020–2024" accent="#3b82f6" />
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={apiData.climate}>
                    {showGrid && <CartesianGrid {...mkGrid(c)} />}
                    <XAxis dataKey="month" {...mkAxis(c)} tickFormatter={v => `M${v}`} />
                    <YAxis yAxisId="l" {...mkAxis(c)} />
                    <YAxis yAxisId="r" orientation="right" {...mkAxis(c)} />
                    <Tooltip contentStyle={mkTooltip(c)} />
                    {showLegend && <Legend wrapperStyle={mkLegend()} />}
                    <Bar yAxisId="l" dataKey="temperature" fill="#ef4444" fillOpacity={0.75} radius={[4,4,0,0]} name="Temp (°C)" />
                    <Line yAxisId="r" type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} dot={false} name="Rainfall (mm)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== MODAL ====================
  const renderModal = () => {
    if (!selectedComponent) return null;
    const biome = selectedComponent.biome || 'tropical';
    const species = (BIOME_SPECIES?.[biome] || SPECIES_DATA)[selectedComponent.id] || [];
    const bgSrc = (BIOME_ECOSYSTEM_IMAGES?.[biome] || {})[LEVEL_KEY_MAP[selectedComponent.id]]?.bg;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setSelectedComponent(null)} />
        <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden" style={{ background: c.cardBg, maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="relative" style={{ height: '340px', minHeight: '340px' }}>
            <EcoImage src={bgSrc} alt={selectedComponent.name} className="w-full h-full" style={{ objectPosition: 'center center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <button onClick={() => setSelectedComponent(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}>✕</button>
            <div className="absolute bottom-4 left-5">
              <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>{selectedComponent.name}</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#6ee7b7' }}>
                Trophic Level {ECOLOGICAL_LEVELS.findIndex(l => l.id === selectedComponent.id)+1} · {BIOMES.find(b => b.id === biome)?.name}
              </p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm mb-5 leading-relaxed" style={{ color: c.textSecondary }}>
              {selectedComponent.description || `${selectedComponent.name} form a critical trophic level in the ${biome} ecosystem, playing an essential role in energy transfer and ecological balance.`}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: c.textMuted }}>
              Example Species in {BIOMES.find(b => b.id === biome)?.name}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {species.slice(0, 8).map((sp, i) => (
                <div key={i} className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: c.cardBgAlt, border: `1px solid ${c.cardBorder}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>{sp.charAt(0)}</div>
                  <span className="text-xs font-medium" style={{ color: c.textPrimary }}>{sp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stabPct = (aggregatedStats?.stability || 0);
  const stabColor = stabPct > 0.7 ? '#10b981' : stabPct > 0.4 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <FontLoader />
      <div ref={containerRef} className={`vis-root min-h-screen transition-colors duration-300 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}
        style={{ background: c.pageBg, color: c.textPrimary }}>

        {/* ── HEADER ── */}
        <div className="sticky top-0 z-40 backdrop-blur-xl border-b"
          style={{ background: darkMode ? 'rgba(13,17,23,0.88)' : 'rgba(255,255,255,0.88)', borderColor: c.cardBorder }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: c.textPrimary }}>
                  Ecosystem <span style={{ color: '#10b981' }}>Visualization</span>
                </h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: simulationRunning ? '#10b981' : c.textMuted, animation: simulationRunning ? 'pulse 1.5s infinite' : 'none' }} />
                  <span className="text-xs font-medium" style={{ color: c.textSecondary }}>{simulationRunning ? 'Live' : 'Paused'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-md text-xs font-semibold tracking-wide"
                  style={{
                    background: connectionStatus === 'connected' ? 'rgba(16,185,129,0.13)' : connectionStatus === 'offline' ? 'rgba(245,158,11,0.13)' : 'rgba(239,68,68,0.13)',
                    color: connectionStatus === 'connected' ? '#10b981' : connectionStatus === 'offline' ? '#f59e0b' : '#ef4444'
                  }}>
                  ● {connectionStatus === 'connected' ? 'Backend OK' : connectionStatus === 'offline' ? 'Offline' : 'Down'}
                </div>
                <button onClick={toggleFS} className="p-1.5 rounded-lg text-sm transition-colors"
                  style={{ color: c.textSecondary, background: 'transparent' }}>⛶</button>
                <button onClick={handleExport} className="p-1.5 rounded-lg text-sm transition-colors"
                  style={{ color: c.textSecondary, background: 'transparent' }}>↓</button>
              </div>
            </div>

            {/* Tabs - सभी tabs दिखेंगे, लेकिन कंटेंट lock होगा */}
            <div className="flex gap-1 mt-4">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={activeTab === tab.id ? {
                    background: '#10b981', color: '#ffffff', boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                  } : {
                    background: 'transparent', color: c.textSecondary,
                  }}
                  onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = c.inputBg; }}
                  onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATUS BAR (सिर्फ premium users के लिए) ── */}
        {isAuthenticated && isPremium && (
          <div className="container mx-auto px-4 pt-4">
            <div className="px-4 py-2.5 rounded-xl border flex items-center justify-between"
              style={{ background: c.statusBg, borderColor: c.statusBorder }}>
              <div className="flex items-center gap-5">
                <span className="text-xs" style={{ color: c.textSecondary }}>
                  Time: <span className="vis-mono font-semibold" style={{ color: c.textPrimary }}>{simulationTime} {timeScale}s</span>
                </span>
                <span className="text-xs" style={{ color: c.textSecondary }}>
                  Points: <span className="vis-mono font-semibold" style={{ color: c.textPrimary }}>{processedData.length}</span>
                </span>
                <span className="text-xs" style={{ color: c.textSecondary }}>
                  Stability: <span className="vis-mono font-semibold" style={{ color: stabColor }}>{(stabPct*100).toFixed(0)}%</span>
                </span>
              </div>
              <span className="text-xs vis-mono" style={{ color: c.textMuted }}>Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="container mx-auto px-4 py-5 space-y-5">
          {renderTabContent()}
        </div>

        {renderModal()}
      </div>
    </>
  );
};

export default EcosystemVisualization;