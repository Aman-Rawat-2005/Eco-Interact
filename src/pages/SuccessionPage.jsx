import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../App";
import { useAuth } from '../context/AuthContext';
import { Crown, Sparkles, Lock } from 'lucide-react';

/* =========================================================
   ECOLOGICAL DATA (unchanged)
   ========================================================= */
const STAGES = {
  PRIMARY: [
    { id: 0, name: "Bare Rock", shortName: "Bare", timeframe: "Year 0", description: "Newly formed volcanic rock or exposed bedrock with no soil or vegetation. Extreme abiotic conditions dominate — no organic matter, intense UV, and wild temperature swings.", icon: "🪨", color: "#78716c", accent: "#d6d3d1", speciesBase: 2, energyBase: 100, characteristics: ["No soil present", "Extreme temperatures", "No organic matter", "High UV exposure"], pioneerSpecies: ["Lichens", "Mosses", "Bacteria"] },
    { id: 1, name: "Pioneer Species", shortName: "Pioneer", timeframe: "1–10 Years", description: "Lichens and mosses colonize rock surfaces. Chemical weathering slowly converts bare rock into thin mineral soil, enabling the first wave of life.", icon: "🌿", color: "#65a30d", accent: "#bef264", speciesBase: 10, energyBase: 500, characteristics: ["Thin soil forming", "Lichens break down rock", "Organic matter accumulates", "Microhabitats forming"], pioneerSpecies: ["Lichens", "Mosses", "Ferns", "Grasses"] },
    { id: 2, name: "Early Succession", shortName: "Early", timeframe: "10–100 Years", description: "Small plants, grasses, and herbs establish as soil depth increases. Insect populations emerge, and nutrient cycling begins in earnest.", icon: "🌱", color: "#16a34a", accent: "#86efac", speciesBase: 25, energyBase: 2000, characteristics: ["Soil deepening", "Annual plants dominate", "Biodiversity rising", "Insects colonise"], pioneerSpecies: ["Grasses", "Wildflowers", "Ferns", "Small shrubs"] },
    { id: 3, name: "Mid Succession", shortName: "Mid", timeframe: "100–300 Years", description: "Shrubs and young trees create layered canopy. Complex food webs develop, soil is fully matured, and wildlife diversity accelerates.", icon: "🌳", color: "#15803d", accent: "#4ade80", speciesBase: 60, energyBase: 5000, characteristics: ["Shrub layer develops", "Young trees appear", "Soil fully mature", "Wildlife increases"], pioneerSpecies: ["Shrubs", "Pine trees", "Oak saplings", "Ferns"] },
    { id: 4, name: "Climax Community", shortName: "Climax", timeframe: "300+ Years", description: "Mature, stable forest ecosystem with dense closed canopy, maximum biodiversity, and intricate multi-trophic food webs. The endpoint of primary succession.", icon: "🏔️", color: "#166534", accent: "#34d399", speciesBase: 120, energyBase: 10000, characteristics: ["Mature forest", "Closed canopy", "Maximum biodiversity", "Stable ecosystem"], pioneerSpecies: ["Oak", "Maple", "Pine", "Ferns", "Mosses", "Wildlife"] }
  ],
  SECONDARY: [
    { id: 0, name: "Disturbance Event", shortName: "Disturbance", timeframe: "Year 0", description: "Forest fire, logging, or other disturbance clears vegetation — but crucially, soil and seed banks remain intact, enabling faster recovery.", icon: "🔥", color: "#b91c1c", accent: "#fca5a5", speciesBase: 5, energyBase: 200, characteristics: ["Soil remains intact", "Seed banks survive", "Root systems present", "Rapid recovery possible"], pioneerSpecies: ["Fireweed", "Grasses", "Ferns"] },
    { id: 1, name: "Pioneer Species", shortName: "Pioneer", timeframe: "1–2 Years", description: "Fast-growing annuals and grasses explode across disturbed ground. Existing soil provides instant nutritional support for colonisation.", icon: "🌾", color: "#ca8a04", accent: "#fde68a", speciesBase: 15, energyBase: 800, characteristics: ["Rapid colonisation", "Annuals dominate", "Sun-loving species", "Quick ground cover"], pioneerSpecies: ["Grasses", "Fireweed", "Raspberry", "Sunflowers"] },
    { id: 2, name: "Grassland Stage", shortName: "Grassland", timeframe: "2–15 Years", description: "Perennial grasses and wildflowers dominate the recovering landscape. Small mammals and insects return, re-establishing foundational food chains.", icon: "🌿", color: "#16a34a", accent: "#86efac", speciesBase: 30, energyBase: 2500, characteristics: ["Perennial grasses", "Wildflowers return", "Insects recover", "Small mammals appear"], pioneerSpecies: ["Goldenrod", "Asters", "Switchgrass", "Buttercups"] },
    { id: 3, name: "Shrubland Stage", shortName: "Shrubland", timeframe: "15–50 Years", description: "Shrubs take hold and begin to shade out grasses. Tree saplings emerge. Bird populations swell as canopy structure increases.", icon: "🌲", color: "#15803d", accent: "#4ade80", speciesBase: 50, energyBase: 4000, characteristics: ["Shrub layer develops", "Tree saplings appear", "Birds increase", "Complex food web"], pioneerSpecies: ["Sumac", "Dogwood", "Willow", "Blackberry"] },
    { id: 4, name: "Forest Recovery", shortName: "Forest", timeframe: "50+ Years", description: "Forest regenerates to near-original state. Canopy closes, understory richens, and biodiversity approaches climax community levels.", icon: "🌳", color: "#166534", accent: "#34d399", speciesBase: 100, energyBase: 9000, characteristics: ["Mature trees dominate", "Closed canopy", "Rich understory", "Ecosystem restored"], pioneerSpecies: ["Oak", "Maple", "Pine", "Hickory", "Beech"] }
  ]
};

const FACTS = [
  { icon: "🏔️", title: "Primary Succession", body: "Takes 1,000+ years to reach a climax community on bare rock." },
  { icon: "🌱", title: "Secondary Succession", body: "50–100× faster than primary due to surviving soil and seed banks." },
  { icon: "🪨", title: "Pioneer Lichens", body: "Can survive −20°C to 50°C — among the most stress-tolerant organisms on Earth." },
  { icon: "⚡", title: "10% Energy Rule", body: "Only ~10% of energy passes between trophic levels; 90% is lost as heat." },
  { icon: "🌍", title: "Soil Formation", body: "1 cm of topsoil takes over 100 years to form through biological weathering." },
  { icon: "🦊", title: "Climax Biodiversity", body: "Mature temperate forests support 100+ species per hectare." },
  { icon: "🔥", title: "Fire Recovery", body: "Fire-adapted ecosystems like pine barrens recover structurally in 5–10 years." },
  { icon: "🌡️", title: "Climate Sensitivity", body: "A 1°C shift can alter the succession timeline by 10–20 years." }
];

const getRainfallMeta = (v) => {
  if (v <= 250) return { label: "Extreme Drought", icon: "🏜️", hue: "#b45309" };
  if (v <= 500) return { label: "Arid", icon: "🏜️", hue: "#d97706" };
  if (v <= 1000) return { label: "Dry", icon: "🌾", hue: "#ca8a04" };
  if (v <= 2000) return { label: "Temperate", icon: "🌳", hue: "#16a34a" };
  if (v <= 3000) return { label: "Wet", icon: "🌴", hue: "#0d9488" };
  return { label: "Super Humid", icon: "💧", hue: "#2563eb" };
};

const getTempMeta = (v) => {
  if (v <= -10) return { label: "Polar", icon: "❄️", hue: "#93c5fd" };
  if (v <= 0) return { label: "Freezing", icon: "🧊", hue: "#60a5fa" };
  if (v <= 10) return { label: "Cold", icon: "🥶", hue: "#3b82f6" };
  if (v <= 20) return { label: "Cool", icon: "🍂", hue: "#06b6d4" };
  if (v <= 25) return { label: "Optimal", icon: "🌱", hue: "#16a34a" };
  if (v <= 30) return { label: "Warm", icon: "☀️", hue: "#f59e0b" };
  if (v <= 40) return { label: "Hot", icon: "🔥", hue: "#ea580c" };
  return { label: "Extreme", icon: "🥵", hue: "#dc2626" };
};

const getDistMeta = (v) => {
  if (v <= 20) return { label: "Stable", icon: "🟢", hue: "#16a34a" };
  if (v <= 40) return { label: "Mild", icon: "🟡", hue: "#ca8a04" };
  if (v <= 60) return { label: "Moderate", icon: "🟠", hue: "#ea580c" };
  if (v <= 80) return { label: "Severe", icon: "🔴", hue: "#dc2626" };
  return { label: "Catastrophic", icon: "💀", hue: "#7c3aed" };
};

const calcGrowth = (r, t) => {
  let g = 1.0;
  if (r >= 800 && r <= 2200) g *= 1.2; else if (r < 400 || r > 3200) g *= 0.5;
  const d = Math.abs(t - 20);
  if (d <= 5) g *= 1.3; else if (d <= 15) g *= 0.8; else g *= 0.4;
  return Math.round(g * 100) / 100;
};

const calcBio = (stageId, type, r, t) => {
  const s = STAGES[type][stageId]; if (!s) return 1;
  let b = s.speciesBase;
  if (r < 250) b *= 0.3; else if (r < 500) b *= 0.5; else if (r < 800) b *= 0.8;
  else if (r <= 2000) b *= 1.2; else if (r <= 3000) b *= 1.0; else b *= 0.7;
  const d = Math.abs(t - 20);
  if (d <= 5) b *= 1.3; else if (d <= 10) b *= 1.0; else if (d <= 15) b *= 0.7;
  else if (d <= 20) b *= 0.4; else b *= 0.2;
  return Math.max(1, Math.round(b));
};

/* =========================================================
   REUSABLE ATOMS
   ========================================================= */

const Pill = ({ children, color }) => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-sans border whitespace-nowrap text-white"
    style={{
      background: color,
      borderColor: `${color}80`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}
  >
    {children}
  </span>
);

const Card = ({ children, style, dark, hover, noPadding }) => {
  const bgColor = dark ? '#1e1e1e' : '#ffffff';
  const textColor = dark ? '#e9ecef' : '#212529';
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10' : ''}`}
      style={{
        background: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        backdropFilter: 'blur(12px)',
        padding: noPadding ? "0" : "clamp(16px, 4vw, 20px)",
        ...style
      }}
    >
      {children}
    </div>
  );
};

const SectionLabel = ({ children, dark }) => (
  <div className="flex items-center gap-2 mb-3.5">
    <div className="w-1 h-4 rounded-sm bg-gradient-to-b from-green-400 to-green-600"></div>
    <span className={`text-[clamp(10px,2.5vw,11px)] font-bold uppercase tracking-widest ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
      {children}
    </span>
  </div>
);

const ClimateSlider = ({ label, value, min, max, step, onChange, unit, meta }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex flex-wrap justify-between items-center gap-1">
        <span className="text-[clamp(10px,2.5vw,11px)] font-bold uppercase tracking-wider text-white">{label}</span>
        <div className="flex items-center gap-1">
          {meta && <span className="text-[clamp(12px,3vw,13px)] text-white">{meta.icon}</span>}
          <span className="text-[clamp(13px,3.5vw,14px)] font-bold font-serif text-white">{value}{unit}</span>
        </div>
      </div>
      {meta && <span className="text-[clamp(10px,2.5vw,11px)] font-medium -mt-0.5 text-white/90">{meta.label}</span>}
      <div className="relative h-2 rounded-full bg-black/20">
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${meta?.hue || "#16a34a"}88,${meta?.hue || "#16a34a"})` }} />
        <input type="range" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} />
      </div>
    </div>
  );
};

const DisturbanceSlider = ({ label, value, min, max, step, onChange, unit, meta }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex flex-wrap justify-between items-center gap-1">
        <span className="text-[clamp(10px,2.5vw,11px)] font-bold uppercase tracking-wider text-white">{label}</span>
        <div className="flex items-center gap-1">
          {meta && <span className="text-[clamp(12px,3vw,13px)] text-white">{meta.icon}</span>}
          <span className="text-[clamp(13px,3.5vw,14px)] font-bold font-serif text-white">{value}{unit}</span>
        </div>
      </div>
      {meta && <span className="text-[clamp(10px,2.5vw,11px)] font-medium -mt-0.5 text-white/90">{meta.label}</span>}
      <div className="relative h-2 rounded-full bg-black/20">
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${meta?.hue || "#b91c1c"}88,${meta?.hue || "#b91c1c"})` }} />
        <input type="range" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} />
      </div>
    </div>
  );
};

/* =========================================================
   BIODIVERSITY CANVAS GRAPH
   ========================================================= */
const BioGraph = ({ history, dark }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 130 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setDimensions({ width: Math.max(200, width), height: Math.max(80, width * 0.325) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = dimensions.width; const H = dimensions.height;
    c.width = W; c.height = H;
    ctx.clearRect(0, 0, W, H);
    const pts = history.length > 1 ? history : [2, 2];
    const mx = Math.max(...pts, 10);
    const toX = i => (i / (pts.length - 1)) * (W - 20) + 10;
    const toY = v => H - 18 - (v / mx) * (H - 28);
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    for (let i = 0; i <= 4; i++) { const y = 8 + ((H - 26) * i / 4); ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(W - 10, y); ctx.stroke(); }
    ctx.setLineDash([]);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(22,163,74,0.18)"); grad.addColorStop(1, "rgba(22,163,74,0.01)");
    ctx.beginPath(); ctx.moveTo(toX(0), H - 18);
    pts.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
    ctx.lineTo(toX(pts.length - 1), H - 18); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    pts.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
    ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
    if (pts.length > 1) {
      const lx = toX(pts.length - 1); const ly = toY(pts[pts.length - 1]);
      ctx.beginPath(); ctx.arc(lx, ly, 8, 0, Math.PI * 2); ctx.fillStyle = "rgba(22,163,74,0.2)"; ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fillStyle = "#16a34a"; ctx.fill();
      ctx.fillStyle = "#16a34a";
      ctx.font = `bold ${Math.max(8, Math.min(10, W * 0.025))}px 'DM Sans',sans-serif`;
      ctx.fillText(`${pts[pts.length - 1]} spp`, Math.max(0, lx - 24), Math.max(12, ly - 12));
    }
  }, [history, dark, dimensions]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={ref} width={dimensions.width} height={dimensions.height} className="w-full h-auto block rounded-lg" />
    </div>
  );
};

/* =========================================================
   SUCCESSION WHEEL
   ========================================================= */
const SuccessionWheel = ({ stages, currentStage, dark }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState(200);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setSize(Math.min(280, Math.max(180, containerWidth)));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cx = size / 2; const cy = size / 2; const r = size * 0.34;
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div ref={containerRef} className="w-full max-w-[280px] mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible block">
        <defs>
          <radialGradient id="wg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={stages[currentStage]?.color || "#16a34a"} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r + size * 0.08} fill="url(#wg)" />
        {stages.map((_, i) => {
          if (i >= stages.length - 1) return null;
          const a1 = (i / stages.length) * 2 * Math.PI - Math.PI / 2;
          const a2 = ((i + 1) / stages.length) * 2 * Math.PI - Math.PI / 2;
          return (
            <line key={i}
              x1={cx + r * Math.cos(a1)} y1={cy + r * Math.sin(a1)}
              x2={cx + r * Math.cos(a2)} y2={cy + r * Math.sin(a2)}
              stroke={i < currentStage ? stages[i].color : (dark ? "rgba(255,255,255,0.1)" : "#e2e8f0")}
              strokeWidth={i < currentStage ? 2 : 1}
              strokeDasharray={i >= currentStage ? "4 4" : undefined} />
          );
        })}
        {stages.map((s, i) => {
          const a = (i / stages.length) * 2 * Math.PI - Math.PI / 2;
          const x = cx + r * Math.cos(a); const y = cy + r * Math.sin(a);
          const active = i === currentStage; const past = i < currentStage;
          return (
            <g key={i} style={{ filter: active ? `drop-shadow(0 0 8px ${s.color}88)` : "none" }}>
              <circle cx={x} cy={y} r={active ? size * 0.09 : size * 0.07}
                fill={active ? s.color : past ? `${s.color}2a` : (dark ? "#1e1e1e" : "#f8fafc")}
                stroke={active ? s.accent : past ? `${s.color}55` : (dark ? "rgba(255,255,255,0.12)" : "#e2e8f0")}
                strokeWidth={active ? 2.5 : 1.5} className="transition-all duration-500" />
              {active && (
                <circle cx={x} cy={y} r={size * 0.12} fill="none" stroke={s.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.35}>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur="10s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={active ? size * 0.054 : size * 0.04} fill={dark ? '#e9ecef' : '#212529'}>{s.icon}</text>
              <text x={x} y={y + (active ? size * 0.14 : size * 0.11)} textAnchor="middle" fontSize={size * 0.032} fontFamily="'DM Sans',sans-serif" fontWeight={600} fill={active ? s.color : muted} letterSpacing="0.05em">{s.shortName.toUpperCase()}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={size * 0.16} fill={dark ? "#1e1e1e" : "#ffffff"} stroke={dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"} strokeWidth={1} style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.1))" }} />
        <text x={cx} y={cy - size * 0.04} textAnchor="middle" fontSize={size * 0.08} fill={dark ? '#e9ecef' : '#212529'}>{stages[currentStage]?.icon}</text>
        <text x={cx} y={cy + size * 0.03} textAnchor="middle" fontSize={size * 0.04} fontFamily="'DM Sans',sans-serif" fontWeight={700} fill={stages[currentStage]?.color}>{stages[currentStage]?.shortName?.toUpperCase()}</text>
        <text x={cx} y={cy + size * 0.08} textAnchor="middle" fontSize={size * 0.028} fontFamily="'DM Sans',sans-serif" fill={muted}>STAGE {(stages[currentStage]?.id || 0) + 1}/5</text>
      </svg>
    </div>
  );
};

/* =========================================================
   ENERGY PYRAMID
   ========================================================= */
const EnergyPyramid = ({ base }) => {
  const levels = [
    { label: "Producers", value: base, color: "#16a34a", emoji: "🌿" },
    { label: "Primary Consumers", value: Math.round(base * 0.1), color: "#ca8a04", emoji: "🐛" },
    { label: "Secondary Consumers", value: Math.round(base * 0.01), color: "#ea580c", emoji: "🐦" },
    { label: "Tertiary Consumers", value: Math.round(base * 0.001), color: "#dc2626", emoji: "🦅" }
  ];
  return (
    <div className="flex flex-col gap-3 w-full py-1">
      {levels.map((l, i) => {
        const pyramidWidth = `${100 - (i * 20)}%`;
        return (
          <div key={l.label} className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2" style={{ width: pyramidWidth, minWidth: "120px" }}>
              <div className="h-10 flex items-center px-3 gap-2.5 w-full rounded-lg border text-white"
                style={{ background: l.color, borderColor: `${l.color}80`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <span className="text-base drop-shadow-md">{l.emoji}</span>
                <span className="text-xs md:text-sm font-semibold font-sans tracking-tight whitespace-nowrap">{l.label}</span>
              </div>
            </div>
            <div className="flex items-center justify-end min-w-[90px] md:min-w-[100px] text-right">
              <span className="text-sm md:text-base font-bold font-serif text-gray-900 dark:text-white px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 whitespace-nowrap tracking-tight">
                {l.value.toLocaleString()} <span className="text-xs font-medium text-gray-500 dark:text-gray-400">kcal</span>
              </span>
            </div>
          </div>
        );
      })}
      <div className="mt-2 p-3 rounded-xl border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 flex items-center gap-2">
        <span className="text-lg">⚡</span>
        <span className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          <span className="text-green-600 dark:text-green-400 font-semibold">10% Energy Rule:</span> Only about 10% of energy transfers between trophic levels.
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   COMPARE PANEL
   ========================================================= */
const calcClimaxYears = (type, distPct, growthRate) => {
  const base = type === "PRIMARY" ? 700 : 80;
  const distPenalty = distPct > 80 ? 2.2 : distPct > 60 ? 1.7 : distPct > 40 ? 1.3 : distPct > 20 ? 1.1 : 1.0;
  return Math.round((base * distPenalty) / Math.max(growthRate, 0.2));
};

const calcPeakSpecies = (stages, distPct, rainfall, temp) => {
  const base = stages[4]?.speciesBase || 100;
  const distMult = distPct > 80 ? 0.38 : distPct > 60 ? 0.55 : distPct > 40 ? 0.72 : distPct > 20 ? 0.88 : 1.0;
  let rMult = 1.0;
  if (rainfall < 250) rMult = 0.3; else if (rainfall < 500) rMult = 0.5;
  else if (rainfall < 800) rMult = 0.75; else if (rainfall <= 2000) rMult = 1.2;
  else if (rainfall <= 3000) rMult = 1.0; else rMult = 0.7;
  const d = Math.abs(temp - 20);
  const tMult = d <= 5 ? 1.3 : d <= 10 ? 1.0 : d <= 15 ? 0.7 : d <= 20 ? 0.4 : 0.2;
  return Math.max(1, Math.round(base * distMult * rMult * tMult));
};

const calcRecoveryRate = (distPct) => {
  if (distPct > 80) return { label: "Very Slow", color: "#7c3aed" };
  if (distPct > 60) return { label: "Slow", color: "#dc2626" };
  if (distPct > 40) return { label: "Moderate", color: "#ea580c" };
  if (distPct > 20) return { label: "Good", color: "#ca8a04" };
  return { label: "Fast", color: "#16a34a" };
};

const MiniBarChart = ({ valueA, valueB, labelA, labelB, colorA, colorB, unit, dark }) => {
  const maxVal = Math.max(valueA, valueB, 1);
  return (
    <div className="flex flex-col gap-3 w-full">
      {[{ val: valueA, label: labelA, color: colorA }, { val: valueB, label: labelB, color: colorB }].map(item => (
        <div key={item.label} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
          <span className={`text-[clamp(9px,2.2vw,10px)] w-full sm:w-[100px] shrink-0 font-sans ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
          <div className={`flex-1 h-6 rounded-md border overflow-hidden relative w-full ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
            <div className="absolute left-0 top-0 h-full flex items-center justify-end px-1.5 transition-all duration-500 rounded-md text-white"
              style={{ width: `${(item.val / maxVal) * 100}%`, background: `linear-gradient(90deg,${item.color}88,${item.color})` }}>
              <span className="text-[clamp(9px,2.2vw,10px)] font-bold font-serif whitespace-nowrap">{item.val.toLocaleString()}{unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ComparePanel = ({ stages, type, rainfall, temp, disturbance, growth, dark }) => {
  const [distA, setDistA] = useState(10);
  const [distB, setDistB] = useState(70);
  const [rainfallC, setRainfallC] = useState(rainfall);
  const [tempC, setTempC] = useState(temp);

  useEffect(() => { setRainfallC(rainfall); }, [rainfall]);
  useEffect(() => { setTempC(temp); }, [temp]);

  const gA = calcGrowth(rainfallC, tempC);
  const speciesA = calcPeakSpecies(stages, distA, rainfallC, tempC);
  const speciesB = calcPeakSpecies(stages, distB, rainfallC, tempC);
  const yearsA = calcClimaxYears(type, distA, gA);
  const yearsB = calcClimaxYears(type, distB, gA);
  const recovA = calcRecoveryRate(distA);
  const recovB = calcRecoveryRate(distB);
  const energyA = Math.round((stages[4]?.energyBase || 9000) * (distA > 60 ? 0.5 : distA > 40 ? 0.72 : distA > 20 ? 0.88 : 1.0));
  const energyB = Math.round((stages[4]?.energyBase || 9000) * (distB > 60 ? 0.5 : distB > 40 ? 0.72 : distB > 20 ? 0.88 : 1.0));
  const rMetaC = getRainfallMeta(rainfallC);
  const tMetaC = getTempMeta(tempC);
  const diffSpecies = speciesA - speciesB;
  const diffYears = yearsB - yearsA;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-[#166534] rounded-xl p-3 md:p-4">
        <div className="text-[clamp(10px,2.5vw,11px)] font-bold text-white/90 uppercase tracking-wider mb-3">Climate Variables (synced with Simulation)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ClimateSlider label="Rainfall" value={rainfallC} min={0} max={4000} step={50} onChange={setRainfallC} unit="mm" meta={rMetaC} />
          <ClimateSlider label="Temperature" value={tempC} min={-20} max={45} step={1} onChange={setTempC} unit="°C" meta={tMetaC} />
        </div>
        <div className="mt-2 px-2.5 py-1.5 bg-black/20 rounded-lg border border-white/20 inline-flex items-center gap-2 flex-wrap">
          <span className="text-[clamp(10px,2.5vw,11px)] text-white/80">Growth Rate:</span>
          <span className="text-[clamp(11px,3vw,12px)] font-bold font-serif text-white">×{gA}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#166534] rounded-xl p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <span className="text-xs md:text-sm font-bold text-white font-sans">Scenario A</span>
            <span className="text-[clamp(10px,2.5vw,11px)] text-white bg-black/20 px-2 py-1 rounded-full font-semibold">{getDistMeta(distA).icon} {getDistMeta(distA).label}</span>
          </div>
          <DisturbanceSlider label="Disturbance" value={distA} min={0} max={100} step={1} onChange={setDistA} unit="%" meta={getDistMeta(distA)} />
        </div>
        <div className="bg-[#b91c1c] rounded-xl p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <span className="text-xs md:text-sm font-bold text-white font-sans">Scenario B</span>
            <span className="text-[clamp(10px,2.5vw,11px)] text-white bg-black/20 px-2 py-1 rounded-full font-semibold">{getDistMeta(distB).icon} {getDistMeta(distB).label}</span>
          </div>
          <DisturbanceSlider label="Disturbance" value={distB} min={0} max={100} step={1} onChange={setDistB} unit="%" meta={getDistMeta(distB)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Peak Species", valA: `${speciesA} spp`, valB: `${speciesB} spp`, winner: speciesA >= speciesB ? "A" : "B" },
          { label: "Climax Time", valA: `${yearsA} yr`, valB: `${yearsB} yr`, winner: yearsA <= yearsB ? "A" : "B" },
          { label: "Ecosystem Energy", valA: `${energyA.toLocaleString()} kcal`, valB: `${energyB.toLocaleString()} kcal`, winner: energyA >= energyB ? "A" : "B" },
        ].map(r => (
          <div key={r.label} className={`rounded-xl p-3 border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`text-[clamp(9px,2.2vw,10px)] font-bold uppercase tracking-wider mb-2.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{r.label}</div>
            {[{ sc: "A", val: r.valA, color: "#16a34a" }, { sc: "B", val: r.valB, color: "#dc2626" }].map(s => (
              <div key={s.sc} className={`flex flex-wrap justify-between items-center mb-1.5 p-2 rounded-lg ${r.winner === s.sc ? (dark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200') : (dark ? 'bg-gray-900/50' : 'bg-gray-50')}`}>
                <span className="text-[clamp(10px,2.5vw,11px)] font-semibold" style={{ color: s.color }}>Scenario {s.sc}</span>
                <span className={`text-[clamp(11px,3vw,12px)] font-bold font-serif ${dark ? 'text-white' : 'text-gray-900'}`}>{s.val}</span>
                {r.winner === s.sc && <span className="text-[clamp(8px,2vw,9px)]" style={{ color: s.color }}>▲ Better</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`rounded-xl p-4 border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`text-[clamp(10px,2.5vw,11px)] font-bold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Species Comparison</div>
          <MiniBarChart valueA={speciesA} valueB={speciesB} labelA={`A · ${distA}% dist.`} labelB={`B · ${distB}% dist.`} colorA="#16a34a" colorB="#dc2626" unit=" spp" dark={dark} />
        </div>
        <div className={`rounded-xl p-4 border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`text-[clamp(10px,2.5vw,11px)] font-bold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Time to Climax</div>
          <MiniBarChart valueA={yearsA} valueB={yearsB} labelA={`A · ${distA}% dist.`} labelB={`B · ${distB}% dist.`} colorA="#16a34a" colorB="#dc2626" unit=" yr" dark={dark} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[{ sc: "A", dist: distA, recov: recovA }, { sc: "B", dist: distB, recov: recovB }].map(s => (
          <div key={s.sc} className="p-3 rounded-xl border flex items-center gap-3 flex-wrap sm:flex-nowrap text-white" style={{ background: s.recov.color, borderColor: `${s.recov.color}80` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 bg-black/20">{getDistMeta(s.dist).icon}</div>
            <div>
              <div className="text-xs md:text-sm font-bold font-sans text-white">Scenario {s.sc} — {s.recov.label}</div>
              <div className="text-[clamp(10px,2.5vw,11px)] text-white/80 mt-1">Disturbance: {s.dist}% · Recovery rate: {s.recov.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#1e3a8a] rounded-xl p-3">
        <div className="text-[clamp(10px,2.5vw,11px)] font-bold text-white/90 uppercase tracking-wider mb-1.5">Live Insight</div>
        <p className="text-xs md:text-sm text-white/90 leading-relaxed font-sans">
          {diffSpecies > 0
            ? `Scenario A (${distA}% disturbance) supports ${diffSpecies} more species and reaches climax ${diffYears} years faster than Scenario B (${distB}% disturbance) under ${rMetaC.label.toLowerCase()} conditions at ${tempC}°C.`
            : diffSpecies < 0
              ? `Scenario B (${distB}% disturbance) unexpectedly supports ${Math.abs(diffSpecies)} more species — adjust sliders to explore the disturbance-biodiversity trade-off.`
              : `Both scenarios produce equal species counts under current climate settings (${rainfallC}mm rainfall, ${tempC}°C). Try adjusting disturbance levels to see divergence.`
          }
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   ABOUT SECTION CONTENT — Primary
   ========================================================= */
const AboutPrimary = ({ dark, setTab }) => {
  const textPrimary = dark ? '#e6edf3' : '#1a202c';
  const textSecondary = dark ? '#8b949e' : '#6b7280';
  const cardBg = dark ? '#161b22' : '#ffffff';
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0';
  const mutedBg = dark ? '#21262d' : '#f8fafc';

  const timeline = [
    { year: "Year 0", title: "Bare Substrate", body: "Exposed volcanic or glacially scoured bedrock presents an entirely abiotic environment. No organic matter, no soil, no moisture retention. Surface temperatures may swing 40°C between day and night. Virtually no life can persist.", color: "#78716c" },
    { year: "Years 1–10", title: "Lichen & Moss Colonisation", body: "Crustose lichens are the first colonisers. Through oxalic acid secretion and physical wedging, they begin breaking the mineral surface. Nitrogen-fixing cyanobacteria within lichen thalli begin enriching the proto-substrate. Mosses follow, trapping wind-blown particles.", color: "#65a30d" },
    { year: "Years 10–100", title: "Early Vascular Plant Establishment", body: "As thin mineral soil accumulates, ferns, grasses, and pioneer herbaceous species take root. Organic matter begins to build. Invertebrate populations — particularly decomposers and detritivores — establish and accelerate nutrient cycling.", color: "#16a34a" },
    { year: "Years 100–300", title: "Shrub & Young Tree Layer", body: "Shrubs outcompete herbaceous plants for light, creating a structured canopy. Young trees — initially light-demanding species like birch and aspen — begin to dominate. Soil maturity increases. Vertebrate fauna, including birds and small mammals, colonise as habitat complexity grows.", color: "#15803d" },
    { year: "300+ Years", title: "Climax Forest Community", body: "Shade-tolerant species (oak, maple, beech) replace early successional trees. The canopy closes, creating distinct vertical layers: emergent, canopy, understorey, shrub, herb, and ground layers. Biodiversity peaks. The ecosystem becomes largely self-sustaining and self-regulating.", color: "#166534" },
  ];

  const keyFacts = [
    { label: "Total Duration", value: "300–1,500 years", desc: "Varies with rock type, climate, and latitude" },
    { label: "Soil Formation Rate", value: "~1 cm / 100 years", desc: "Biological weathering drives mineral-to-soil conversion" },
    { label: "Peak Biodiversity", value: "100+ species/ha", desc: "Achieved in mature temperate climax forest" },
    { label: "Energy at Climax", value: "10,000 kcal base", desc: "Maximum producer biomass and energy flow" },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.35s ease-out' }}>
      {/* Hero Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-6" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, #1c1917 0%, #292524 18%, #3f3f46 32%, #4a7c59 52%, #166534 72%, #052e16 100%)'
        }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 70%, #6ee7b7 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, #78716c 0%, transparent 45%)'
        }} />
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rocky" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#d6d3d1"/>
              <circle cx="30" cy="25" r="1" fill="#a8a29e"/>
              <circle cx="20" cy="35" r="2" fill="#78716c"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rocky)"/>
        </svg>
        <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10" style={{ minHeight: '340px' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 w-fit"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="text-xs text-stone-200 font-semibold uppercase tracking-wider">Primary Succession</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-serif text-white leading-tight mb-3">
            From Bare Rock<br />to <span style={{ color: '#6ee7b7' }}>Climax Forest</span>
          </h1>
          <p className="text-sm md:text-base leading-relaxed max-w-xl mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Primary succession is the gradual colonisation of entirely barren substrate — volcanic basalt, glacial till, or freshly exposed bedrock — by successive communities of organisms, each modifying the environment to enable the next. The process unfolds over centuries without any prior biological legacy.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white shadow-lg transition-all"
              style={{ background: '#16a34a', border: '1px solid rgba(74,222,128,0.4)' }}
              onClick={() => setTab("simulation")}>
              Run Simulation
            </button>
            <button className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={() => setTab("stages")}>
              View All Stages
            </button>
          </div>
        </div>
      </div>

      {/* Overview + Key Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 rounded-2xl p-5 md:p-6 border" style={{ background: cardBg, borderColor: cardBorder }}>
          <h2 className="text-lg font-bold font-serif mb-3" style={{ color: textPrimary }}>What is Primary Succession?</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: textSecondary }}>
            Primary succession begins where no ecosystem previously existed — on freshly cooled lava flows, retreating glacier moraines, coastal sand dunes, or newly formed islands. Unlike secondary succession, there is no residual soil structure, seed bank, or organic matter to accelerate recovery. Every stage must be built from the mineral up.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: textSecondary }}>
            The process is driven by <span className="font-semibold" style={{ color: '#16a34a' }}>facilitation</span> — each successional community makes the environment more hospitable for the next. Lichens break rock into mineral particles and add organic acids; mosses capture soil and retain moisture; grasses add nitrogen and organic carbon; shrubs provide shade and litter. Each stage is both an end product and a precondition.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
            Climate strongly governs succession rate. In warm, humid temperate zones with 800–2,200 mm annual rainfall, progression from bare rock to closed-canopy forest may take 300–500 years. In polar or arid regions, the same trajectory can require over 1,500 years or may never fully complete.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {keyFacts.map((f, i) => (
            <div key={i} className="rounded-xl p-4 border" style={{ background: cardBg, borderColor: cardBorder }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#16a34a' }}>{f.label}</div>
              <div className="text-base font-bold font-serif mb-0.5" style={{ color: textPrimary }}>{f.value}</div>
              <div className="text-xs" style={{ color: textSecondary }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="rounded-2xl p-5 md:p-6 border mb-4" style={{ background: cardBg, borderColor: cardBorder }}>
        <h2 className="text-lg font-bold font-serif mb-1" style={{ color: textPrimary }}>Stage-by-Stage Progression</h2>
        <p className="text-xs mb-5" style={{ color: textSecondary }}>Each successional stage modifies abiotic conditions, enabling the next community to establish.</p>
        <div className="flex flex-col gap-0">
          {timeline.map((t, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center shrink-0" style={{ width: '40px' }}>
                <div className="w-3 h-3 rounded-full border-2 mt-1 shrink-0" style={{ background: t.color, borderColor: t.color }} />
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: `${t.color}44`, minHeight: '32px' }} />}
              </div>
              <div className={`pb-5 flex-1 ${i === timeline.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ background: t.color }}>{t.year}</span>
                  <span className="text-sm font-bold font-serif" style={{ color: textPrimary }}>{t.title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate & Disturbance Influence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: cardBorder }}>
          <h3 className="text-base font-bold font-serif mb-2" style={{ color: textPrimary }}>Climate Influence</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: textSecondary }}>
            Temperature and rainfall are the dominant abiotic drivers of succession rate. At optimal conditions (18–25°C, 800–2,200 mm rainfall), growth multipliers reach 1.56×, significantly accelerating stage transitions.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Optimal Rainfall", value: "800–2,200 mm/yr", note: "Temperate to wet regime" },
              { label: "Optimal Temperature", value: "15–25°C", note: "Maximum enzymatic activity" },
              { label: "Climate Stress Effect", value: "Up to −60% growth", note: "Polar or arid extremes" },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-start p-2.5 rounded-lg border" style={{ background: mutedBg, borderColor: cardBorder }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: textPrimary }}>{r.label}</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>{r.note}</div>
                </div>
                <span className="text-xs font-bold font-serif ml-2 shrink-0" style={{ color: '#16a34a' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: cardBorder }}>
          <h3 className="text-base font-bold font-serif mb-2" style={{ color: textPrimary }}>Disturbance Effects</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: textSecondary }}>
            On bare rock substrates, disturbance events can set succession back dramatically. Severe erosion, volcanic re-eruption, or glacial advance can strip newly formed soil and reset communities to earlier stages.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Low Disturbance (0–20%)", value: "Stable", note: "Succession proceeds normally", color: "#16a34a" },
              { label: "Moderate (40–60%)", value: "1–3 stages lost", note: "Significant regression possible", color: "#ea580c" },
              { label: "Catastrophic (>80%)", value: "Full reset risk", note: "Decades of recovery lost", color: "#7c3aed" },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-start p-2.5 rounded-lg border" style={{ background: mutedBg, borderColor: cardBorder }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: textPrimary }}>{r.label}</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>{r.note}</div>
                </div>
                <span className="text-xs font-bold font-serif ml-2 shrink-0" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Ecological Concepts */}
      <div className="rounded-2xl p-5 md:p-6 border" style={{ background: cardBg, borderColor: cardBorder }}>
        <h2 className="text-lg font-bold font-serif mb-4" style={{ color: textPrimary }}>Key Ecological Concepts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Facilitation", body: "The dominant mechanism in primary succession — each community modifies the environment in ways that favour establishment of the next, more competitive community." },
            { title: "10% Energy Rule", body: "At each trophic level, approximately 90% of energy is lost as heat through metabolic processes. Only ~10% is transferred to the next level, limiting food chain length." },
            { title: "Seral Communities", body: "Each transitional community between bare rock and climax is called a sere. Primary succession on rock passes through lithosere, then mosssere, then herbaceous, shrub, and forest seres." },
            { title: "Pedogenesis", body: "Soil formation is the rate-limiting step in primary succession. The conversion of parent rock material to fertile soil via biological and chemical weathering takes centuries." },
            { title: "Climax Community", body: "The stable, self-perpetuating end-state of succession, theoretically in equilibrium with the prevailing climate. In temperate zones, this is typically a mixed deciduous forest." },
            { title: "Niche Differentiation", body: "As succession progresses, habitat complexity increases, enabling more species to partition resources. Climax communities support orders of magnitude more species than pioneer stages." },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ background: mutedBg, borderColor: cardBorder }}>
              <div className="text-sm font-bold font-serif mb-1.5" style={{ color: '#16a34a' }}>{c.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ABOUT SECTION CONTENT — Secondary
   ========================================================= */
const AboutSecondary = ({ dark, setTab }) => {
  const textPrimary = dark ? '#e6edf3' : '#1a202c';
  const textSecondary = dark ? '#8b949e' : '#6b7280';
  const cardBg = dark ? '#161b22' : '#ffffff';
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0';
  const mutedBg = dark ? '#21262d' : '#f8fafc';

  const timeline = [
    { year: "Year 0", title: "Disturbance Event", body: "Fire, logging, flooding, or agricultural abandonment removes the above-ground vegetation layer. Crucially, the soil profile — including its organic horizon, mycorrhizal networks, invertebrate fauna, and dormant seed bank — remains largely intact.", color: "#b91c1c" },
    { year: "Years 1–2", title: "Rapid Pioneer Establishment", body: "Wind-dispersed annuals — fireweed, thistle, ragwort — and dormant seeds germinating from the soil bank colonise the open ground within months. Bare soil coverage closes rapidly, preventing erosion. Root systems from pre-disturbance plants may regenerate directly.", color: "#ca8a04" },
    { year: "Years 2–15", title: "Grassland & Perennial Phase", body: "Perennial grasses, wildflowers, and early successional forbs replace annuals. Soil fauna re-establishes — earthworms, beetles, and nematodes accelerate decomposition. Small mammals and ground-nesting birds return as herbaceous cover thickens.", color: "#16a34a" },
    { year: "Years 15–50", title: "Shrubland Development", body: "Woody shrubs — sumac, dogwood, hawthorn — outcompete grasses for light. Tree saplings begin establishing beneath the shrub layer. Avian diversity increases sharply as structural complexity provides nesting habitat. Mycorrhizal networks re-expand through the soil.", color: "#15803d" },
    { year: "50+ Years", title: "Forest Recovery", body: "Canopy closure occurs as dominant tree species reach maturity. The understorey diversifies with shade-tolerant species. Biodiversity approaches climax levels within 80–150 years, depending on disturbance severity and climate. The ecosystem functions as a near-complete restoration of pre-disturbance forest.", color: "#166534" },
  ];

  const keyFacts = [
    { label: "Recovery Duration", value: "50–200 years", desc: "Highly dependent on disturbance severity" },
    { label: "Speed vs Primary", value: "50–100× faster", desc: "Due to surviving soil and seed banks" },
    { label: "Seed Bank Depth", value: "Up to 20 cm", desc: "Viable seeds can persist for decades" },
    { label: "Mycorrhizal Advantage", value: "3–5× faster root growth", desc: "Fungal networks re-inoculate new plants" },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.35s ease-out' }}>
      {/* Hero Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-6" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, #1a0a00 0%, #431407 20%, #7c2d12 35%, #854d0e 50%, #3f6212 68%, #166534 85%, #052e16 100%)'
        }} />
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 80%, #fde68a 0%, transparent 40%), radial-gradient(ellipse at 80% 20%, #4ade80 0%, transparent 45%)'
        }} />
        <svg className="absolute inset-0 w-full h-full opacity-8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ember" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="#fbbf24"/>
              <circle cx="45" cy="40" r="1.5" fill="#f97316"/>
              <circle cx="30" cy="50" r="0.8" fill="#fde68a"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ember)"/>
        </svg>
        <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10" style={{ minHeight: '340px' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 w-fit"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-300" />
            <span className="text-xs text-orange-200 font-semibold uppercase tracking-wider">Secondary Succession</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-serif text-white leading-tight mb-3">
            After Disturbance —<br /><span style={{ color: '#fde68a' }}>Resilience</span> in Action
          </h1>
          <p className="text-sm md:text-base leading-relaxed max-w-xl mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Secondary succession occurs when a disturbance — wildfire, logging, flooding, or land abandonment — removes existing vegetation while leaving the soil intact. The preserved biological legacy of soil, seeds, and fungal networks enables recovery that is dramatically faster than primary succession.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white shadow-lg transition-all"
              style={{ background: '#b91c1c', border: '1px solid rgba(252,165,165,0.4)' }}
              onClick={() => setTab("simulation")}>
              Run Simulation
            </button>
            <button className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={() => setTab("stages")}>
              View All Stages
            </button>
          </div>
        </div>
      </div>

      {/* Overview + Key Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 rounded-2xl p-5 md:p-6 border" style={{ background: cardBg, borderColor: cardBorder }}>
          <h2 className="text-lg font-bold font-serif mb-3" style={{ color: textPrimary }}>What is Secondary Succession?</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: textSecondary }}>
            Secondary succession begins where an established ecosystem has been disrupted but not destroyed at the soil level. The defining characteristic — and the primary reason for its speed — is the presence of a biological legacy: a structured soil profile containing organic matter, mineral nutrients, living invertebrates, fungal hyphae, and a dormant seed bank that can contain hundreds of viable seeds per square metre.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: textSecondary }}>
            Unlike primary succession, which depends on the slow weathering of rock into soil, secondary succession can begin producing above-ground vegetation within weeks of a disturbance. Fireweed (<em>Epilobium angustifolium</em>), a classic secondary pioneer, can colonise a burned area within a single growing season. Root systems of pre-disturbance plants may resprout from surviving root crowns or rhizomes.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
            The trajectory of secondary succession is strongly influenced by disturbance severity. A low-intensity surface fire may allow 90% of soil organisms to survive, enabling near-immediate recovery. Catastrophic disturbances — such as strip mining or severe erosion — that remove or sterilise the soil layer may effectively convert secondary succession into primary succession, dramatically extending recovery timelines.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {keyFacts.map((f, i) => (
            <div key={i} className="rounded-xl p-4 border" style={{ background: cardBg, borderColor: cardBorder }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b91c1c' }}>{f.label}</div>
              <div className="text-base font-bold font-serif mb-0.5" style={{ color: textPrimary }}>{f.value}</div>
              <div className="text-xs" style={{ color: textSecondary }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="rounded-2xl p-5 md:p-6 border mb-4" style={{ background: cardBg, borderColor: cardBorder }}>
        <h2 className="text-lg font-bold font-serif mb-1" style={{ color: textPrimary }}>Stage-by-Stage Recovery</h2>
        <p className="text-xs mb-5" style={{ color: textSecondary }}>Post-disturbance recovery follows a predictable sequence, accelerated by the surviving biological legacy.</p>
        <div className="flex flex-col gap-0">
          {timeline.map((t, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center shrink-0" style={{ width: '40px' }}>
                <div className="w-3 h-3 rounded-full border-2 mt-1 shrink-0" style={{ background: t.color, borderColor: t.color }} />
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: `${t.color}44`, minHeight: '32px' }} />}
              </div>
              <div className={`pb-5 flex-1 ${i === timeline.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ background: t.color }}>{t.year}</span>
                  <span className="text-sm font-bold font-serif" style={{ color: textPrimary }}>{t.title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate & Disturbance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: cardBorder }}>
          <h3 className="text-base font-bold font-serif mb-2" style={{ color: textPrimary }}>Climate Influence</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: textSecondary }}>
            Warm, moist temperate climates maximise secondary succession speed. Soil microbial activity, germination rates, and above-ground plant growth all respond positively to temperatures in the 15–25°C range combined with consistent rainfall.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Peak Recovery Climate", value: "18–22°C / 1,000–2,000 mm", note: "Optimal for soil biota activity" },
              { label: "Drought Impact", value: "Delays 2–5× normal", note: "Seed germination and seedling survival impaired" },
              { label: "Frost Limitation", value: "Reduces growing season", note: "Limits pioneer establishment in boreal zones" },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-start p-2.5 rounded-lg border" style={{ background: mutedBg, borderColor: cardBorder }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: textPrimary }}>{r.label}</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>{r.note}</div>
                </div>
                <span className="text-xs font-bold font-serif ml-2 shrink-0" style={{ color: '#b91c1c' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: cardBorder }}>
          <h3 className="text-base font-bold font-serif mb-2" style={{ color: textPrimary }}>Disturbance Severity Scale</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: textSecondary }}>
            The degree of soil disturbance is the critical variable governing secondary succession rate. Soil integrity determines whether recovery follows the fast secondary trajectory or regresses towards a slower, primary-like pathway.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Surface Fire (low severity)", value: "5–20 yr recovery", note: "Soil and seed bank largely intact", color: "#16a34a" },
              { label: "Moderate Logging", value: "30–70 yr recovery", note: "Compaction and erosion slow recovery", color: "#ea580c" },
              { label: "Catastrophic / Soil Removed", value: "100–500 yr recovery", note: "Approaches primary succession timeline", color: "#7c3aed" },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-start p-2.5 rounded-lg border" style={{ background: mutedBg, borderColor: cardBorder }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: textPrimary }}>{r.label}</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>{r.note}</div>
                </div>
                <span className="text-xs font-bold font-serif ml-2 shrink-0" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Ecological Concepts */}
      <div className="rounded-2xl p-5 md:p-6 border" style={{ background: cardBg, borderColor: cardBorder }}>
        <h2 className="text-lg font-bold font-serif mb-4" style={{ color: textPrimary }}>Key Ecological Concepts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Biological Legacy", body: "Surviving soil organisms, root systems, dormant seeds, and fungal networks collectively constitute the biological legacy — the primary reason secondary succession outpaces primary succession by 50–100×.", color: "#b91c1c" },
            { title: "Seed Bank Dynamics", body: "Soil seed banks can contain 10,000–80,000 viable seeds per square metre. Fire-triggered germination cues — smoke chemicals, heat — activate specific pioneer species adapted to post-disturbance conditions.", color: "#ca8a04" },
            { title: "Inhibition vs Facilitation", body: "Unlike primary succession (driven by facilitation), secondary succession often involves inhibition — established colonisers actively prevent later successional species from establishing until they senesce.", color: "#15803d" },
            { title: "Mycorrhizal Networks", body: "Surviving fungal networks inoculate incoming plants, accelerating nutrient uptake by 3–5× compared to plants establishing in sterile primary substrates. These networks transfer carbon between plants.", color: "#0891b2" },
            { title: "Intermediate Disturbance", body: "The Intermediate Disturbance Hypothesis proposes that moderate, periodic disturbance maximises biodiversity by preventing competitive exclusion by late-successional dominants.", color: "#7c3aed" },
            { title: "Resilience vs Resistance", body: "Secondary succession demonstrates ecosystem resilience — the capacity to recover after disturbance. High disturbance frequency can shift ecosystems from resilient forest to persistently arrested grassland or shrubland.", color: "#166534" },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ background: mutedBg, borderColor: cardBorder }}>
              <div className="text-sm font-bold font-serif mb-1.5" style={{ color: c.color }}>{c.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   LOCK CARD COMPONENT
   ========================================================= */
const LockCard = ({ isLoginLock, message, onNavigate, dark }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="max-w-md w-full p-8 rounded-2xl" style={{ 
      backgroundColor: dark ? '#161b22' : '#ffffff', 
      border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}` 
    }}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`} 
        style={{ backgroundColor: isLoginLock ? (dark ? '#21262d' : '#f1f5f9') : 'rgba(234,179,8,0.15)' }}>
        {isLoginLock ? (
          <Lock className="w-8 h-8" style={{ color: dark ? '#8b949e' : '#6b7280' }} />
        ) : (
          <Crown className="w-8 h-8 text-yellow-500" />
        )}
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: dark ? '#e6edf3' : '#1a202c' }}>
        {isLoginLock ? 'Login Required' : 'Premium Feature'}
      </h2>
      <p className="text-sm mb-6" style={{ color: dark ? '#8b949e' : '#6b7280' }}>{message}</p>
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

/* =========================================================
   MAIN PAGE
   ========================================================= */
export default function SuccessionPage() {
  const { darkMode } = useContext(DarkModeContext);
  const { isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [type, setType] = useState("PRIMARY");
  const [currentStage, setCurrentStage] = useState(0);
  const [years, setYears] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [rainfall, setRainfall] = useState(1200);
  const [temp, setTemp] = useState(20);
  const [disturbance, setDisturbance] = useState(10);
  const [distLog, setDistLog] = useState([]);
  const [bioHistory, setBioHistory] = useState([2]);
  const [tab, setTab] = useState("about");
  const [factIdx, setFactIdx] = useState(0);
  const [prevDist, setPrevDist] = useState(10);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const timerRef = useRef(null);

  const stages = STAGES[type];
  const stage = stages[currentStage];
  const rMeta = getRainfallMeta(rainfall);
  const tMeta = getTempMeta(temp);
  const dMeta = getDistMeta(disturbance);
  const growth = calcGrowth(rainfall, temp);
  const bio = calcBio(currentStage, type, rainfall, temp);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFactIdx(i => (i + 1) % FACTS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (Math.abs(disturbance - prevDist) >= 15 && years > 0) {
      setDistLog(l => [...l, { year: Math.round(years), ...dMeta }]);
      if (disturbance > 60 && currentStage > 0) setCurrentStage(s => Math.max(0, s - (disturbance > 80 ? 2 : 1)));
    }
    setPrevDist(disturbance);
  }, [disturbance]);

  const tick = useCallback(() => {
    setYears(y => {
      const increment = speed <= 3 ? 0.5 * speed : speed <= 20 ? speed * 1.5 : speed * 2;
      const next = y + increment;
      const dur = type === "PRIMARY" ? [10, 90, 200, 300, Infinity] : [2, 13, 35, 50, Infinity];
      const pen = disturbance > 60 ? 2.0 : disturbance > 40 ? 1.5 : 1.0;
      let cumulative = 0, newStage = 0;
      for (let i = 0; i < dur.length - 1; i++) {
        cumulative += (dur[i] * pen) / growth;
        if (next < cumulative) { newStage = i; break; }
        newStage = Math.min(i + 1, 4);
      }
      const clampedStage = Math.min(newStage, 4);
      setCurrentStage(clampedStage);
      setBioHistory(h => [...h.slice(-80), calcBio(clampedStage, type, rainfall, temp)]);
      return next;
    });
  }, [speed, type, growth, disturbance, rainfall, temp]);

  useEffect(() => {
    if (playing) timerRef.current = setInterval(tick, 350);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [playing, tick]);

  const reset = () => {
    setPlaying(false); setCurrentStage(0); setYears(0);
    setBioHistory([STAGES[type][0].speciesBase]); setDistLog([]);
  };

  const switchType = (t) => {
    setType(t); setPlaying(false); setCurrentStage(0); setYears(0);
    setBioHistory([STAGES[t][0].speciesBase]); setDistLog([]);
  };

  const simulationGrid = windowWidth < 1024 ? (windowWidth < 768 ? "1fr" : "1fr 1fr") : "290px 1fr 300px";
  const statsGrid = windowWidth < 640 ? "1fr" : (windowWidth < 1024 ? "repeat(2,1fr)" : "repeat(5,1fr)");
  const stagesGrid = windowWidth < 768 ? "1fr" : "1fr 1fr";

  const headerBg = darkMode ? 'rgba(13,17,23,0.88)' : 'rgba(255,255,255,0.88)';
  const headerBorder = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)';
  const textPrimary = darkMode ? '#e6edf3' : '#1a202c';
  const textSecondary = darkMode ? '#8b949e' : '#6b7280';
  const inputBg = darkMode ? '#21262d' : '#f1f5f9';

  const TABS = [
    { id: 'about',      label: 'About' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'stages',     label: 'All Stages' },
    { id: 'compare',    label: 'Compare' },
  ];

  // ==================== RENDER TAB CONTENT ====================
  const renderTabContent = () => {
    // About tab - हमेशा दिखेगा (बिना किसी lock के)
    if (tab === 'about') {
      return type === "PRIMARY" 
        ? <AboutPrimary dark={darkMode} setTab={setTab} />
        : <AboutSecondary dark={darkMode} setTab={setTab} />;
    }

    // Simulation, Stages, Compare tabs - ये सब premium चाहिए
    if (!isAuthenticated) {
      return (
        <LockCard 
          isLoginLock={true}
          message="Please login to access simulations, stages, and comparison tools."
          onNavigate={() => navigate("/login")}
          dark={darkMode}
        />
      );
    }

    if (!isPremium) {
      return (
        <LockCard 
          isLoginLock={false}
          message="Upgrade to premium to access advanced succession simulations, all stages, and scenario comparison."
          onNavigate={() => navigate("/upgrade")}
          dark={darkMode}
        />
      );
    }

    // Premium user - अब ही ये tabs दिखेंगे (पूरा original डेटा वापस)
    switch(tab) {
      case 'simulation':
        return (
          <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: simulationGrid, animation: 'fadeUp 0.35s ease-out' }}>
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-3 md:gap-4">
              <Card dark={darkMode}>
                <SectionLabel dark={darkMode}>⏯ Time Controller</SectionLabel>
                <div className="flex gap-2 mb-3">
                  <button className="flex-1 h-10 md:h-12 rounded-lg text-xl md:text-2xl font-semibold border-2 transition-all duration-200 shadow-md"
                    onClick={() => setPlaying(p => !p)}
                    style={{
                      background: playing ? '#dc2626' : '#16a34a', color: '#ffffff',
                      borderColor: playing ? '#b91c1c' : '#15803d',
                      boxShadow: playing ? '0 4px 6px -1px rgba(220,38,38,0.3)' : '0 4px 6px -1px rgba(22,163,74,0.3)'
                    }}>
                    {playing ? "⏸ PAUSE" : "▶ PLAY"}
                  </button>
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-lg text-lg md:text-xl font-bold border-2 transition-all duration-200 shadow-md"
                    onClick={reset} title="Reset"
                    style={{ background: darkMode ? '#374151' : '#6b7280', color: '#ffffff', borderColor: darkMode ? '#4b5563' : '#4b5563' }}>↺</button>
                </div>

                <div className="mb-3">
                  <div className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>SIMULATION SPEED</div>
                  <div className="grid grid-cols-4 gap-1 mb-1">
                    {[0.5, 1, 2, 3].map(s => (
                      <button key={s} className="h-7 md:h-8 rounded-md text-[10px] md:text-xs font-bold border-2 transition-all duration-200 shadow-sm"
                        onClick={() => setSpeed(s)}
                        style={{
                          background: speed === s ? '#16a34a' : (darkMode ? '#374151' : '#e5e7eb'),
                          color: speed === s ? '#ffffff' : (darkMode ? '#d1d5db' : '#1f2937'),
                          borderColor: speed === s ? '#15803d' : (darkMode ? '#4b5563' : '#d1d5db')
                        }}>{s}×</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[20, 50, 100].map(s => (
                      <button key={s} className="h-7 md:h-8 rounded-md text-[10px] md:text-xs font-bold border-2 transition-all duration-200 shadow-sm"
                        onClick={() => setSpeed(s)}
                        style={{
                          background: speed === s ? '#ea580c' : (darkMode ? '#374151' : '#e5e7eb'),
                          color: speed === s ? '#ffffff' : (darkMode ? '#d1d5db' : '#1f2937'),
                          borderColor: speed === s ? '#c2410c' : (darkMode ? '#4b5563' : '#d1d5db')
                        }}>{s}×</button>
                    ))}
                  </div>
                  {speed >= 20 && (
                    <div className="mt-2 p-1.5 rounded-md border text-center" style={{ background: darkMode ? 'rgba(234,88,12,0.15)' : '#fff7ed', borderColor: darkMode ? '#c2410c' : '#fed7aa' }}>
                      <span className="text-[10px] md:text-xs font-semibold" style={{ color: darkMode ? '#fb923c' : '#c2410c' }}>⚡ Turbo mode — {speed}× fast-forward</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap justify-between items-center mb-1">
                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>YEAR SCRUBBER</span>
                    <span className="text-xs md:text-sm font-bold font-serif px-2 py-0.5 rounded-full border" style={{ background: darkMode ? 'rgba(22,163,74,0.15)' : '#f0fdf4', color: '#16a34a', borderColor: darkMode ? '#15803d' : '#bbf7d0' }}>Yr {Math.round(years)}</span>
                  </div>
                  {(() => {
                    const maxYears = type === "PRIMARY" ? 1000 : 150;
                    const pct = Math.min((years / maxYears) * 100, 100);
                    const milestones = type === "PRIMARY"
                      ? [{ yr: 10, lbl: "Pioneer" }, { yr: 100, lbl: "Early" }, { yr: 300, lbl: "Mid" }, { yr: 600, lbl: "Climax" }]
                      : [{ yr: 2, lbl: "Pioneer" }, { yr: 15, lbl: "Grass" }, { yr: 50, lbl: "Shrub" }, { yr: 100, lbl: "Forest" }];
                    return (
                      <div>
                        <div className={`relative h-3 rounded-full mb-1 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
                          <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200 bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${pct}%` }} />
                          {milestones.map(m => {
                            const mPct = Math.min((m.yr / maxYears) * 100, 100);
                            return <div key={m.yr} className="absolute top-1/2 -translate-y-1/2 w-1 h-4 rounded-full z-10 shadow-md" style={{ left: `${mPct}%`, background: years >= m.yr ? '#16a34a' : (darkMode ? '#9ca3af' : '#6b7280'), border: '1px solid white' }} />;
                          })}
                          <input type="range" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            min={0} max={maxYears} step={type === "PRIMARY" ? 5 : 1} value={Math.round(years)}
                            onChange={e => {
                              const newYear = +e.target.value; setPlaying(false); setYears(newYear);
                              const dur = type === "PRIMARY" ? [10, 90, 200, 300, Infinity] : [2, 13, 35, 50, Infinity];
                              let cumulative = 0, newStage = 0;
                              for (let i = 0; i < dur.length; i++) { cumulative += dur[i]; if (newYear < cumulative) { newStage = i; break; } newStage = i; }
                              setCurrentStage(Math.min(newStage, 4));
                              setBioHistory(h => [...h.slice(-80), calcBio(Math.min(newStage, 4), type, rainfall, temp)]);
                            }} />
                        </div>
                        <div className="relative h-5 mt-1">
                          {milestones.map(m => {
                            const mPct = Math.min((m.yr / maxYears) * 100, 100);
                            return <span key={m.yr} className={`absolute -translate-x-1/2 text-[8px] md:text-[9px] font-semibold whitespace-nowrap px-1 py-0.5 rounded ${years >= m.yr ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' : (darkMode ? 'text-gray-500' : 'text-gray-400')}`} style={{ left: `${mPct}%` }}>{m.lbl}</span>;
                          })}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-[8px] md:text-[9px] font-medium px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>Yr 0</span>
                          <span className={`text-[8px] md:text-[9px] font-medium px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>Yr {maxYears}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className={`text-center p-2 rounded-lg border-2 ${playing ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' : (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300')}`}>
                  <span className={`text-[10px] md:text-xs font-bold ${playing ? 'text-green-700 dark:text-green-400' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                    {playing ? `● RUNNING at ${speed}×` : "◼ PAUSED — drag scrubber to jump"}
                  </span>
                </div>
              </Card>

              <Card dark={darkMode}>
                <SectionLabel dark={darkMode}>🌦 Climate Controls</SectionLabel>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rainfall: {rainfall}mm</span>
                    <span className="text-xs font-semibold" style={{ color: rMeta.hue }}>{rMeta.icon} {rMeta.label}</span>
                  </div>
                  <input type="range" min={0} max={4000} step={50} value={rainfall} onChange={e => setRainfall(+e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(90deg, ${rMeta.hue}88, ${rMeta.hue})` }} />
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Temperature: {temp}°C</span>
                    <span className="text-xs font-semibold" style={{ color: tMeta.hue }}>{tMeta.icon} {tMeta.label}</span>
                  </div>
                  <input type="range" min={-20} max={45} step={1} value={temp} onChange={e => setTemp(+e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(90deg, ${tMeta.hue}88, ${tMeta.hue})` }} />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Growth</div>
                      <div className={`text-xs md:text-sm font-bold font-serif ${growth >= 1 ? 'text-green-600' : 'text-red-600'}`}>×{growth}</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stress</div>
                      <div className={`text-xs md:text-sm font-bold font-serif ${growth < 0.5 ? 'text-red-600' : growth < 0.8 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {growth < 0.5 ? 'High' : growth < 0.8 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card dark={darkMode}>
                <SectionLabel dark={darkMode}>💥 Disturbance</SectionLabel>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Intensity: {disturbance}%</span>
                    <span className="text-xs font-semibold" style={{ color: dMeta.hue }}>{dMeta.icon} {dMeta.label}</span>
                  </div>
                  <input type="range" min={0} max={100} step={1} value={disturbance} onChange={e => setDisturbance(+e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(90deg, ${dMeta.hue}88, ${dMeta.hue})` }} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Severity</div>
                      <div className="text-xs md:text-sm font-bold font-serif" style={{ color: dMeta.hue }}>{dMeta.label}</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recovery</div>
                      <div className="text-xs md:text-sm font-bold font-serif" style={{ color: dMeta.hue }}>
                        {disturbance > 80 ? '50-100yr' : disturbance > 60 ? '20-50yr' : disturbance > 40 ? '5-20yr' : '1-5yr'}
                      </div>
                    </div>
                  </div>
                  {distLog.length > 0 && (
                    <div>
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Event Log</div>
                      {[...distLog].reverse().slice(0, 4).map((e, i) => (
                        <div key={i} className={`flex flex-wrap justify-between p-1.5 rounded-lg border mb-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                          <span className="text-[10px] md:text-xs font-semibold" style={{ color: e.hue }}>{e.icon} {e.label}</span>
                          <span className={`text-[10px] md:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>yr {e.year}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* CENTER COLUMN */}
            <div className="flex flex-col gap-3 md:gap-4">
              <Card dark={darkMode}>
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                  <div className="w-full max-w-[280px]">
                    <SuccessionWheel stages={stages} currentStage={currentStage} dark={darkMode} />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                      <span className="text-2xl md:text-3xl">{stage?.icon}</span>
                      <div>
                        <div className="text-base md:text-lg font-bold font-serif" style={{ color: stage?.color }}>{stage?.name}</div>
                        <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stage?.timeframe}</div>
                      </div>
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stage?.description}</p>
                    <div className="mb-3">
                      <div className="flex flex-wrap justify-between mb-1">
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progression</span>
                        <span className="text-[10px] md:text-xs font-bold" style={{ color: stage?.color }}>{currentStage + 1} / 5</span>
                      </div>
                      <div className="flex gap-1">
                        {stages.map((s, i) => (
                          <div key={i} className="flex-1 h-1.5 rounded-sm transition-all duration-500"
                            style={{ background: i <= currentStage ? s.color : (darkMode ? '#374151' : '#e2e8f0'), boxShadow: i === currentStage ? `0 0 8px ${s.color}66` : 'none' }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stage?.characteristics.map((c, i) => <Pill key={i} color={stage.color}>{c}</Pill>)}
                    </div>
                    {currentStage >= 4 && (
                      <div className={`mt-3 p-2 rounded-lg border ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                        <span className={`text-xs md:text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>🏆 Climax Community reached in {Math.round(years)} years!</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card dark={darkMode}>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <SectionLabel dark={darkMode}>📈 Biodiversity Over Time</SectionLabel>
                  <span className={`text-xs md:text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>● {bio} species</span>
                </div>
                <BioGraph history={bioHistory} dark={darkMode} />
                <div className="flex flex-wrap justify-between mt-1">
                  <span className={`text-[9px] md:text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Year 0</span>
                  <span className={`text-[9px] md:text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peak: {Math.max(...bioHistory)} spp</span>
                  <span className={`text-[9px] md:text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Year {Math.round(years)}</span>
                </div>
              </Card>

              <Card dark={darkMode}>
                <SectionLabel dark={darkMode}>⚡ Energy Pyramid — 10% Rule</SectionLabel>
                <EnergyPyramid base={stage?.energyBase || 100} />
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-3 md:gap-4">
              <Card dark={darkMode}>
                <SectionLabel dark={darkMode}>🔬 Research Data</SectionLabel>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { k: "Biodiversity", v: `${bio} spp`, c: "#27ae60" },
                    { k: "Energy Level", v: `${(stage?.energyBase || 0).toLocaleString()} kcal`, c: "#7c3aed" },
                    { k: "Climate Regime", v: `${rMeta.icon} ${rMeta.label}`, c: rMeta.hue },
                    { k: "Temperature", v: `${tMeta.icon} ${tMeta.label} (${temp}°C)`, c: tMeta.hue },
                    { k: "Disturbance", v: `${dMeta.icon} ${dMeta.label}`, c: dMeta.hue },
                    { k: "Growth Rate", v: `×${growth}`, c: growth >= 1 ? "#27ae60" : "#dc2626" },
                    { k: "Time Elapsed", v: `${Math.round(years)} yr`, c: "#0891b2" },
                    { k: "Pioneer Species", v: stage?.pioneerSpecies?.slice(0, 2).join(", "), c: "#ca8a04" }
                  ].map(r => (
                    <div key={r.k} className={`flex flex-wrap justify-between items-center p-1.5 rounded-lg border gap-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                      <span className={`text-[10px] md:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{r.k}</span>
                      <span className="text-[10px] md:text-xs font-bold font-serif max-w-[150px] text-right break-words" style={{ color: r.c }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                {disturbance > 70 && (
                  <div className={`mt-3 p-2 rounded-lg border ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                    <div className={`text-xs md:text-sm font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>⚠ High Disturbance Alert</div>
                    <div className={`text-[10px] md:text-xs mt-1 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>Severe disturbance slowing succession</div>
                  </div>
                )}
                {growth < 0.5 && (
                  <div className={`mt-3 p-2 rounded-lg border ${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className={`text-xs md:text-sm font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>🌡 Climate Stress Warning</div>
                    <div className={`text-[10px] md:text-xs mt-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>Suboptimal climate: growth ×{growth}</div>
                  </div>
                )}
              </Card>

              <Card dark={darkMode}>
                <SectionLabel dark={darkMode}>📚 Did You Know?</SectionLabel>
                <div className="min-h-[90px] overflow-hidden mb-2">
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                    <div className="text-sm mb-1">
                      {FACTS[factIdx].icon} <span className={`text-xs md:text-sm font-bold font-serif ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{FACTS[factIdx].title}</span>
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{FACTS[factIdx].body}</p>
                  </div>
                </div>
                <div className="flex gap-1 justify-center flex-wrap mb-3">
                  {FACTS.map((_, i) => (
                    <button key={i} onClick={() => setFactIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === factIdx ? 'w-4 bg-green-600' : `w-1.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}`} />
                  ))}
                </div>
              </Card>

              <Card dark={darkMode}>
                <div className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>📖 Scientific Note</div>
                <p className={`text-xs md:text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {type === "PRIMARY"
                    ? "Primary succession on bare rock is driven by autotrophic pioneer lichens that excrete organic acids, fragmenting mineral substrate into proto-soil over centuries."
                    : "Secondary succession benefits from legacy effects — soil structure, mycorrhizal networks, seed banks, and residual root systems — dramatically reducing establishment barriers."}
                </p>
              </Card>
            </div>
          </div>
        );

      case 'stages':
        return (
          <div style={{ animation: 'fadeUp 0.35s ease-out' }}>
            <div className="mb-4 md:mb-6">
              <h2 className={`text-xl md:text-2xl font-bold font-serif ${darkMode ? 'text-white' : 'text-gray-900'}`}>All 5 Succession Stages</h2>
              <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Full stage reference. Currently at: <span className="font-bold" style={{ color: stage?.color }}>{stage?.name}</span>
              </p>
            </div>

            <Card dark={darkMode} style={{ marginBottom: '1rem' }}>
              <SectionLabel dark={darkMode}>📅 Succession Timeline</SectionLabel>
              <div className="flex items-center overflow-x-auto pb-1 gap-0">
                {stages.map((s, i) => (
                  <div key={i} className="flex items-center shrink-0">
                    <div className={`flex flex-col items-center gap-1 p-2 md:p-3 rounded-lg ${i === currentStage ? (darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200') : ''}`}>
                      <div className="text-lg md:text-xl">{s.icon}</div>
                      <div className={`text-[9px] md:text-xs font-bold text-center max-w-[40px] md:max-w-[70px]`} style={{ color: i <= currentStage ? s.color : (darkMode ? '#6b7280' : '#9ca3af') }}>{s.shortName}</div>
                      <div className={`text-[8px] md:text-[9px] text-center max-w-[40px] md:max-w-[80px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s.timeframe}</div>
                    </div>
                    {i < stages.length - 1 && (
                      <div className="h-0.5 w-3 md:w-6 rounded-full mx-0.5 md:mx-1" style={{ background: i < currentStage ? s.color : (darkMode ? '#374151' : '#e2e8f0') }} />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-3" style={{ gridTemplateColumns: stagesGrid }}>
              {stages.map((s, i) => {
                const active = i === currentStage; const past = i < currentStage;
                return (
                  <div key={s.id} className={`rounded-xl md:rounded-2xl p-4 md:p-5 relative overflow-hidden border-2 transition-all ${darkMode ? (active ? 'bg-gray-800 border-green-800' : 'bg-gray-800 border-gray-700') : (active ? 'bg-white border-green-300' : 'bg-white border-gray-200')}`}>
                    {active && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg,${s.color},${s.accent})` }} />}
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <div className="flex gap-2 md:gap-3 items-center flex-wrap">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                          style={{ background: darkMode ? `${s.color}20` : `${s.color}10` }}>{s.icon}</div>
                        <div>
                          <div className="text-sm md:text-base font-bold font-serif" style={{ color: active ? s.color : (darkMode ? '#ffffff' : '#000000') }}>{s.name}</div>
                          <div className={`text-[10px] md:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.timeframe}</div>
                        </div>
                      </div>
                      {active && <Pill color={s.color}>● Active</Pill>}
                      {past && <Pill color="#64748b">✓ Done</Pill>}
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.description}</p>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {[
                        { label: "Species", val: `${calcBio(i, type, rainfall, temp)}`, color: "#27ae60", icon: "🦋" },
                        { label: "Energy", val: `${s.energyBase.toLocaleString()}`, color: "#7c3aed", icon: "⚡" },
                        { label: "Stage", val: `${i + 1} / 5`, color: s.color, icon: "📍" }
                      ].map(m => (
                        <div key={m.label} className={`rounded-lg p-1.5 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className={`text-[8px] md:text-[9px] mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.icon} {m.label}</div>
                          <div className="text-[10px] md:text-xs font-bold font-serif" style={{ color: m.color }}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-2">
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Characteristics</div>
                      <div className="flex flex-wrap gap-1">{s.characteristics.map((c, ci) => <Pill key={ci} color={s.color}>{c}</Pill>)}</div>
                    </div>
                    <div>
                      <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key Species</div>
                      <div className="flex flex-wrap gap-1">
                        {s.pioneerSpecies.map((sp, si) => (
                          <span key={si} className={`text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>🌿 {sp}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'compare':
        return (
          <div style={{ animation: 'fadeUp 0.35s ease-out' }}>
            <div className="mb-4 md:mb-6">
              <h2 className={`text-xl md:text-2xl font-bold font-serif ${darkMode ? 'text-white' : 'text-gray-900'}`}>Scenario Comparison</h2>
              <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Adjust both disturbance scenarios and climate — all results update instantly in real time.
              </p>
            </div>
            <Card dark={darkMode}>
              <ComparePanel stages={stages} type={type} rainfall={rainfall} temp={temp} disturbance={disturbance} growth={growth} dark={darkMode} />
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== RENDER STATUS BAR ====================
  const renderStatusBar = () => {
    // Status bar सिर्फ premium users के लिए, और सिर्फ simulation/stages tabs में
    if (!isAuthenticated || !isPremium || (tab !== 'simulation' && tab !== 'stages')) {
      return null;
    }

    return (
      <div className="container mx-auto px-4 pt-4">
        <div className="px-4 py-2.5 rounded-xl border flex items-center justify-between"
          style={{
            background: darkMode ? '#161b22' : '#ffffff',
            borderColor: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
          }}>
          <div className="flex items-center gap-5">
            <span className="text-xs" style={{ color: textSecondary }}>
              Year: <span className="font-mono font-semibold" style={{ color: textPrimary }}>{Math.round(years)}</span>
            </span>
            <span className="text-xs" style={{ color: textSecondary }}>
              Stage: <span className="font-mono font-semibold" style={{ color: stage?.color || '#10b981' }}>{stage?.shortName}</span>
            </span>
            <span className="text-xs" style={{ color: textSecondary }}>
              Species: <span className="font-mono font-semibold" style={{ color: '#10b981' }}>{bio}</span>
            </span>
            <span className="text-xs" style={{ color: textSecondary }}>
              Growth: <span className="font-mono font-semibold" style={{ color: growth >= 1 ? '#10b981' : '#ef4444' }}>×{growth}</span>
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: darkMode ? '#484f58' : '#9ca3af' }}>
            {type === "PRIMARY" ? "🪨 Primary" : "🔥 Secondary"} Succession
          </span>
        </div>
      </div>
    );
  };

  // ==================== RENDER STATS CARDS ====================
  const renderStatsCards = () => {
    // Stats cards सिर्फ premium users के लिए, और सिर्फ simulation/stages tabs में
    if (!isAuthenticated || !isPremium || (tab !== 'simulation' && tab !== 'stages')) {
      return null;
    }

    return (
      <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: statsGrid }}>
        {[
          { label: "Years", value: `${Math.round(years)}`, unit: "yr", icon: "⏱", color: "#27ae60", sub: playing ? "▲ Running" : "◼ Paused" },
          { label: "Stage", value: stage?.shortName, icon: "📍", color: stage?.color || "#27ae60", sub: stage?.timeframe },
          { label: "Species", value: `${bio}`, icon: "🦋", color: "#ca8a04", sub: `Base: ${stage?.speciesBase}` },
          { label: "Energy", value: (stage?.energyBase || 0).toLocaleString(), icon: "⚡", color: "#7c3aed", sub: "kcal" },
          { label: "Growth", value: `×${growth}`, icon: "📈", color: growth >= 1 ? "#27ae60" : "#dc2626", sub: growth >= 1 ? "Favourable" : "Climate stress" }
        ].map((s, i) => (
          <div key={i}
            className="rounded-xl md:rounded-2xl p-3 md:p-4 relative overflow-hidden border"
            style={{
              background: darkMode ? '#161b22' : '#ffffff',
              borderColor: darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
              animation: `fadeUp 0.4s ease-out ${i * 0.06}s both`
            }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl md:rounded-t-2xl"
              style={{ background: `linear-gradient(90deg,${s.color}33,${s.color})` }} />
            <div className="text-[9px] md:text-xs font-semibold uppercase tracking-wider mb-0.5 md:mb-1"
              style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>
              {s.icon} {s.label}
            </div>
            <div className="text-base md:text-xl font-bold font-serif mb-0.5" style={{ color: s.color }}>
              {s.value}<span className="text-[10px] md:text-xs ml-1 font-sans" style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>{s.unit}</span>
            </div>
            <div className="text-[9px] md:text-xs" style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        .suc-root * { font-family: 'Inter', 'DM Sans', system-ui, -apple-system, sans-serif; }
        
        body { margin: 0; overflow-x: hidden; }
      `}</style>

      <div className={`suc-root min-h-screen transition-colors duration-300 overflow-x-hidden ${darkMode ? 'bg-[#0d1117]' : 'bg-[#f4f6f9]'}`}>

        {/* HEADER */}
        <div className="sticky top-0 z-40 backdrop-blur-xl border-b"
          style={{ background: headerBg, borderColor: headerBorder }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: textPrimary }}>
                  Ecological <span style={{ color: '#10b981' }}>Succession</span>
                </h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: playing ? '#10b981' : (darkMode ? '#484f58' : '#9ca3af'),
                      animation: playing ? 'pulse-dot 1.5s infinite' : 'none'
                    }} />
                  <span className="text-xs font-medium" style={{ color: textSecondary }}>
                    {playing ? 'Live' : 'Paused'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg overflow-hidden border"
                  style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                  {["PRIMARY", "SECONDARY"].map(t => (
                    <button key={t}
                      className="px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5"
                      onClick={() => switchType(t)}
                      style={{
                        background: type === t ? '#10b981' : 'transparent',
                        color: type === t ? '#ffffff' : textSecondary,
                        boxShadow: type === t ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
                      }}>
                      <span>{t === "PRIMARY" ? "🪨" : "🔥"}</span>
                      <span className="hidden sm:inline">{t === "PRIMARY" ? "Primary" : "Secondary"}</span>
                    </button>
                  ))}
                </div>
                <div className="px-2 py-1 rounded-md text-xs font-semibold tracking-wide"
                  style={{
                    background: playing ? 'rgba(16,185,129,0.13)' : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                    color: playing ? '#10b981' : textSecondary
                  }}>
                  ● {playing ? `${speed}× Speed` : stage?.shortName}
                </div>
              </div>
            </div>
            <div className="flex gap-1 mt-4">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={tab === t.id ? {
                    background: '#10b981',
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                  } : {
                    background: 'transparent',
                    color: textSecondary,
                  }}
                  onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.background = inputBg; }}
                  onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.background = 'transparent'; }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS BAR - सिर्फ premium users के लिए */}
        {renderStatusBar()}

        {/* MAIN CONTENT */}
        <main className="container mx-auto px-4 py-5 space-y-5">
          
          {/* STATS CARDS - सिर्फ premium users के लिए */}
          {renderStatsCards()}

          {/* TAB CONTENT - About tab सबको दिखेगा, बाकी premium के लिए */}
          {renderTabContent()}

        </main>
      </div>
    </>
  );
}