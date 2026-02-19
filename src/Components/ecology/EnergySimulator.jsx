import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Play, Pause, RotateCcw, Zap, TrendingUp, Activity } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

// ✅ Same SliderWithTrack fix used in BiomassCalculator
const SliderWithTrack = ({
  min, max, step = 1, value, onChange,
  fillColor = '#22c55e',
  darkMode,
  extraClass = '',
}) => {
  const D = darkMode;
  const empty = D ? '#2d2d2d' : '#d1d5db';
  const thumbBorder = D ? '#000000' : '#ffffff';
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* ✅ Visible gradient track div — always shows fill + empty color */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0, right: 0,
        height: 8,
        borderRadius: 4,
        transform: 'translateY(-50%)',
        background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, ${empty} ${pct}%, ${empty} 100%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ✅ Native input transparent — custom div shows through */}
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`esim-slider ${extraClass}`}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: 28,
          margin: 0, padding: 0,
          cursor: 'pointer',
          zIndex: 1,
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          background: 'transparent',
          outline: 'none',
          border: 'none',
        }}
      />

      {/* Inject thumb CSS scoped here */}
      <style>{`
        .esim-slider {
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
        /* ✅ Green thumb default */
        .esim-slider::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          background: ${fillColor} !important;
          border: 3px solid ${thumbBorder} !important;
          box-shadow: 0 0 0 2px ${fillColor}55, 0 2px 8px rgba(0,0,0,0.4) !important;
          cursor: pointer !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
          margin-top: -7px !important;
        }
        .esim-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25) !important;
          box-shadow: 0 0 0 4px ${fillColor}35, 0 4px 14px rgba(0,0,0,0.5) !important;
        }
        .esim-slider::-moz-range-thumb {
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          background: ${fillColor} !important;
          border: 3px solid ${thumbBorder} !important;
          box-shadow: 0 0 0 2px ${fillColor}55 !important;
          cursor: pointer !important;
        }
        /* ✅ Track transparent so custom div shows */
        .esim-slider::-webkit-slider-runnable-track {
          background: transparent !important;
          height: 8px !important;
          border-radius: 4px !important;
        }
        .esim-slider::-moz-range-track {
          background: transparent !important;
          height: 8px !important;
          border-radius: 4px !important;
        }
        /* Blue thumb for speed */
        .esim-slider-speed::-webkit-slider-thumb {
          background: #a78bfa !important;
          box-shadow: 0 0 0 2px rgba(167,139,250,0.5), 0 2px 8px rgba(0,0,0,0.4) !important;
        }
        .esim-slider-speed::-moz-range-thumb {
          background: #a78bfa !important;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const EnergySimulator = ({
  producerEnergy,
  setProducerEnergy,
  isAnimating,
  setIsAnimating,
  simulationSpeed,
  setSimulationSpeed,
  darkMode,
  energyLevels,
  energyLoss,
  historicalMultiplier = 1,
  selectedYear = 2024,
  originalProducerEnergy,
}) => {
  const D = darkMode;
  const MIN = 1000, MAX = 25000;
  const fmt = v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

  // ── Style helpers ─────────────────────────────────────────────────────────
  const HT = { color: D ? '#ffffff' : '#111827' };
  const ST = { color: D ? '#9ca3af' : '#6b7280' };
  const LT = { color: D ? '#d1d5db' : '#4b5563' };
  const panelSt = { backgroundColor: D ? '#111111' : '#f9fafb' };
  const trackSt = { backgroundColor: D ? '#2d2d2d' : '#e5e7eb' };

  return (
    <GlassCard darkMode={D} className="relative overflow-hidden">
      {/* Background energy particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.07 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-400"
            animate={{
              x: [Math.random() * 300, Math.random() * 300],
              y: [Math.random() * 400, Math.random() * 400],
              scale: [0, 1, 0],
            }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Sun className="text-yellow-500 animate-pulse flex-shrink-0" size={22} />
            <h3 className="text-base sm:text-lg font-bold truncate" style={HT}>
              Energy Flow Simulator
            </h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setIsAnimating(!isAnimating)}
              className="p-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: isAnimating ? '#dc2626' : '#16a34a' }}
            >
              {isAnimating ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setProducerEnergy(20000)}
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: '#2563eb' }}
            >
              <RotateCcw size={16} />
            </motion.button>
          </div>
        </div>

        {/* ── Historical year badge ───────────────────────────────────────── */}
        {historicalMultiplier !== 1 && (
          <div
            className="mb-3 p-2 rounded-lg text-center text-xs font-medium"
            style={{
              backgroundColor: D ? 'rgba(59,130,246,0.08)' : '#eff6ff',
              border: '1px solid rgba(59,130,246,0.3)',
              color: D ? '#60a5fa' : '#1d4ed8',
            }}
          >
            📅 Year {selectedYear} · Multiplier: {historicalMultiplier.toFixed(2)}x
          </div>
        )}

        {/* ── Speed control ───────────────────────────────────────────────── */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold flex items-center gap-1" style={LT}>
              <Activity size={13} /> Simulation Speed
            </label>
            <span className="text-xs font-mono font-bold" style={{ color: '#a78bfa' }}>
              {simulationSpeed}x
            </span>
          </div>

          {/* ✅ Custom visible track — purple/violet for speed */}
          <SliderWithTrack
            min={0.5} max={3} step={0.5}
            value={simulationSpeed}
            onChange={setSimulationSpeed}
            fillColor="#a78bfa"
            darkMode={D}
            extraClass="esim-slider-speed"
          />

          <div className="flex justify-between text-xs mt-2 px-0.5" style={ST}>
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* ── Producer energy slider ──────────────────────────────────────── */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold flex items-center gap-1" style={HT}>
              <Zap size={15} className="text-yellow-500" /> Producer Energy
            </span>
            <motion.span
              key={producerEnergy}
              initial={{ scale: 1.2, color: '#22c55e' }}
              animate={{ scale: 1 }}
              className="font-mono font-bold text-sm tabular-nums"
              style={HT}
            >
              {Math.round(producerEnergy).toLocaleString()} kcal
            </motion.span>
          </div>

          {/* ✅ Custom visible track — green for energy */}
          <SliderWithTrack
            min={MIN} max={MAX} step={100}
            value={producerEnergy}
            onChange={setProducerEnergy}
            fillColor="#22c55e"
            darkMode={D}
          />

          <div className="flex justify-between px-0.5 mt-2">
            {[MIN, 5000, 10000, 15000, 20000, MAX].map(v => (
              <span key={v} className="text-xs tabular-nums" style={ST}>{fmt(v)}</span>
            ))}
          </div>
        </div>

        {/* ── Energy level bars ───────────────────────────────────────────── */}
        <div className="space-y-2.5 mb-5">
          {energyLevels.map((level, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: level.color }}
                  />
                  <span style={LT}>{level.level}</span>
                </div>
                <span className="font-mono font-semibold tabular-nums" style={HT}>
                  {Math.round(level.energy * (historicalMultiplier || 1)).toLocaleString()} kcal
                  <span className="ml-1" style={ST}>({level.percentage?.toFixed(1) || '0'}%)</span>
                </span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden" style={trackSt}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: level.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(level.energy / producerEnergy) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 80 }}
                />
                {i < 3 && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-400 opacity-60"
                    style={{ left: '10%' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Energy loss panel ───────────────────────────────────────────── */}
        <div
          className="p-3 rounded-xl mb-4"
          style={{
            backgroundColor: D ? 'rgba(220,38,38,0.08)' : '#fef2f2',
            border: D ? '1px solid rgba(220,38,38,0.25)' : '1px solid #fecaca',
          }}
        >
          <div className="flex items-start gap-2.5">
            <div
              className="p-1.5 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'rgba(220,38,38,0.15)' }}
            >
              <TrendingUp className="text-red-500" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-0.5" style={HT}>
                Energy Loss: {Math.round(energyLoss?.totalLoss || 0).toLocaleString()} kcal
              </h4>
              <p className="text-xs" style={ST}>90% energy lost between trophic levels</p>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {[
                  { label: 'Respiration', val: '60%', color: '#ef4444' },
                  { label: 'Heat',        val: '30%', color: '#f97316' },
                  { label: 'Undigested',  val: '10%', color: '#eab308' },
                ].map((s, i) => (
                  <div key={i} className="p-1.5 rounded-lg text-center" style={panelSt}>
                    <span className="block text-xs" style={ST}>{s.label}</span>
                    <span className="font-bold text-xs" style={{ color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick action buttons ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '⬇️ Min Energy', val: 1000  },
            { label: '⬆️ Max Energy', val: 25000 },
          ].map(btn => (
            <button
              key={btn.val}
              onClick={() => setProducerEnergy(btn.val)}
              className="py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default EnergySimulator;