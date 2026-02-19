import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PYRAMID = [
  { key: 'tertiary',  label: 'Tertiary',  fullName: 'Tertiary Consumers',  icon: '🐺', pct: '0.1%', color: '#ef4444', idx: 3 },
  { key: 'secondary', label: 'Secondary', fullName: 'Secondary Consumers', icon: '🦊', pct: '1%',   color: '#f97316', idx: 2 },
  { key: 'primary',   label: 'Primary',   fullName: 'Primary Consumers',   icon: '🦌', pct: '10%',  color: '#eab308', idx: 1 },
  { key: 'producers', label: 'Producers', fullName: 'Producers',           icon: '🌿', pct: '100%', color: '#22c55e', idx: 0 },
];

const TrophicPyramid = ({ levels, darkMode, onLevelClick }) => {
  const [hovered, setHovered] = useState(null);
  const D = darkMode;

  const HT = { color: D ? '#ffffff' : '#111827' };
  const ST = { color: D ? '#6b7280' : '#9ca3af' };
  const cardSt = { backgroundColor: D ? '#0d0d0d' : '#ffffff', boxShadow: D ? '0 4px 20px rgba(0,0,0,0.9)' : '0 2px 12px rgba(0,0,0,0.07)' };

  const getEnergy = (idx) => levels[idx]?.energy || 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Pyramid rows — top is narrow (tertiary), bottom is wide (producers) */}
      <div className="space-y-1.5 mb-8">
        {PYRAMID.map((row, i) => {
          const energy = getEnergy(row.idx);
          const widthPct = 40 + i * 15; // 40% → 55% → 70% → 85%
          const isH = hovered === i;

          return (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              style={{ width: `${widthPct}%`, margin: '0 auto' }}
            >
              <motion.div
                whileHover={{ scale: 1.025 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => onLevelClick?.(row)}
                className="cursor-pointer rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  ...cardSt,
                  border: isH
                    ? `2px solid ${row.color}`
                    : D ? '2px solid rgba(255,255,255,0.07)' : '2px solid #e5e7eb',
                  boxShadow: isH
                    ? `0 0 20px ${row.color}40`
                    : cardSt.boxShadow,
                }}
              >
                <div className="flex items-center justify-between p-3 sm:p-4">
                  {/* Left accent + icon */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: row.color, minHeight: 36 }} />
                    <span className="text-xl sm:text-2xl">{row.icon}</span>
                    <div>
                      <div className="font-bold text-sm sm:text-base" style={HT}>{row.label}</div>
                      <div className="text-xs hidden sm:block" style={ST}>{row.fullName}</div>
                    </div>
                  </div>

                  {/* Right — energy value */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-sm sm:text-base" style={{ color: row.color }}>
                      {energy >= 1000 ? `${(energy / 1000).toFixed(1)}k` : energy.toFixed(0)}
                      <span className="text-xs ml-1" style={ST}>kcal</span>
                    </div>
                    <div className="text-xs" style={ST}>{row.pct}</div>
                  </div>
                </div>

                {/* Energy fill bar */}
                <div className="mx-3 sm:mx-4 mb-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: D ? '#1a1a1a' : '#f3f4f6' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: row.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${[0.1, 1, 10, 100][row.idx]}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  />
                </div>
              </motion.div>

              {/* 10% arrow between levels */}
              {i < 3 && (
                <div className="flex justify-center my-0.5">
                  <motion.span
                    className="text-xs font-semibold"
                    style={ST}
                    animate={{ y: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓ 10%
                  </motion.span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Base gradient line */}
      <div
        className="h-px w-full rounded-full mb-6"
        style={{ background: 'linear-gradient(to right, transparent, #22c55e, transparent)' }}
      />

      {/* Stats mini-cards (responsive: 2-col mobile → 4-col desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {PYRAMID.map((row, i) => {
          const energy = getEnergy(row.idx);
          return (
            <motion.div
              key={row.key}
              whileHover={{ y: -3 }}
              onClick={() => onLevelClick?.(row)}
              className="p-3 rounded-xl cursor-pointer transition-all"
              style={{
                ...cardSt,
                border: D ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb',
              }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${row.color}`; }}
              onMouseLeave={e => { e.currentTarget.style.border = D ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb'; }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: row.color + '20' }}
                >
                  {row.icon}
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: row.color }}>{row.label}</div>
                  <div className="text-xs" style={ST}>{row.pct}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={ST}>Energy</span>
                <span className="font-mono font-bold text-xs" style={{ color: row.color }}>
                  {energy.toFixed(0)} kcal
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 10% Rule summary */}
      <motion.div
        className="mt-5 p-4 rounded-xl text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          backgroundColor: D ? '#0d0d0d' : '#f9fafb',
          border: D ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb',
        }}
      >
        <h4 className="font-semibold text-green-500 mb-2 text-sm">⚡ 10% Energy Transfer Rule</h4>
        <div className="flex flex-wrap justify-center items-center gap-1.5 text-sm">
          {['producers', 'primary', 'secondary', 'tertiary'].map((k, i) => {
            const row = PYRAMID.find(r => r.key === k) || PYRAMID[3 - i];
            const energy = getEnergy(i);
            return (
              <React.Fragment key={k}>
                <span className="font-mono font-bold tabular-nums" style={{ color: row.color }}>
                  {energy.toFixed(0)}
                </span>
                {i < 3 && <span style={ST}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-xs mt-2" style={ST}>Only 10% of energy transfers between each trophic level</p>
      </motion.div>

      {/* Hover tooltip (center-screen) */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 px-4 py-3 rounded-xl pointer-events-none"
            style={{
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              backgroundColor: '#000000',
              border: `1.5px solid ${PYRAMID[hovered].color}`,
              boxShadow: `0 8px 32px rgba(0,0,0,1), 0 0 16px ${PYRAMID[hovered].color}30`,
              color: '#f3f4f6',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{PYRAMID[hovered].icon}</span>
              <div>
                <div className="font-bold">{PYRAMID[hovered].fullName}</div>
                <div className="text-xs" style={ST}>
                  {getEnergy(PYRAMID[hovered].idx).toFixed(0)} kcal · {PYRAMID[hovered].pct} of total
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrophicPyramid;