import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, GitBranch, LayoutGrid, LineChart } from 'lucide-react';

const GRADIENTS = {
  pyramid: 'linear-gradient(135deg, #22c55e, #16a34a)',
  chain:   'linear-gradient(135deg, #eab308, #ca8a04)',
  web:     'linear-gradient(135deg, #f97316, #ea580c)',
  graph:   'linear-gradient(135deg, #3b82f6, #2563eb)',
};

const MODES = [
  { id: 'pyramid', label: 'Pyramid', icon: <BarChart3 size={18} />, desc: '3D trophic pyramid' },
  { id: 'chain',   label: 'Chain',   icon: <GitBranch size={18} />, desc: 'Linear food chain' },
  { id: 'web',     label: 'Web',     icon: <LayoutGrid size={18} />, desc: 'Complex food web' },
  { id: 'graph',   label: 'Graph',   icon: <LineChart size={18} />,  desc: 'Energy flow chart' },
];

const ViewModeToggle = ({ viewMode, setViewMode, darkMode }) => {
  const D = darkMode;

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
      {MODES.map((mode) => {
        const active = viewMode === mode.id;

        const inactiveSt = D
          ? { backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.08)', color: '#d1d5db' }
          : { backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#4b5563' };

        const activeSt = {
          background: GRADIENTS[mode.id],
          border: '1px solid transparent',
          color: '#ffffff',
          boxShadow: D ? '0 4px 20px rgba(0,0,0,0.8)' : '0 4px 16px rgba(0,0,0,0.15)',
        };

        return (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(mode.id)}
            className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all group"
            style={active ? activeSt : inactiveSt}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.backgroundColor = D ? '#1a1a1a' : '#e5e7eb';
                e.currentTarget.style.border = D
                  ? '1px solid rgba(255,255,255,0.15)'
                  : '1px solid #d1d5db';
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.backgroundColor = D ? '#111111' : '#f3f4f6';
                e.currentTarget.style.border = D
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid #e5e7eb';
              }
            }}
          >
            {mode.icon}
            <span className="hidden xs:inline sm:inline">{mode.label}</span>

            {/* Tooltip */}
            <span
              className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs px-2 py-1 rounded-lg pointer-events-none z-20"
              style={{
                backgroundColor: '#000000',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.9)',
              }}
            >
              {mode.desc}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ViewModeToggle;