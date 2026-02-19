import React from 'react';
import { motion } from 'framer-motion';

// ─── Absolute-black dark palette (same as QuizPage) ──────────────────────────
// CARD:    #0d0d0d   BORDER: rgba(255,255,255,0.08)
// SHADOW:  rgba(0,0,0,1)   HOVER-BORDER: rgba(74,222,128,0.35)

const GlassCard = ({
  children,
  className = '',
  darkMode,
  onClick,
  hoverEffect = true,
  padding = 'p-6',
  rounded = 'rounded-2xl',
  gradient = false
}) => {
  const D = darkMode;

  const baseSt = D
    ? {
        backgroundColor: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.95)',
      }
    : {
        backgroundColor: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(209,213,219,0.5)',
        boxShadow: '0 8px 32px rgba(16,185,129,0.08)',
        backdropFilter: 'blur(12px)',
      };

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? { y: -4, transition: { type: 'spring', stiffness: 400, damping: 17 } }
          : {}
      }
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative ${rounded} ${padding} transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={baseSt}
      onMouseEnter={e => {
        if (D) {
          e.currentTarget.style.border = '1px solid rgba(74,222,128,0.30)';
          e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,1)';
        } else {
          e.currentTarget.style.border = '1px solid rgba(74,222,128,0.35)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(16,185,129,0.12)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = baseSt.border;
        e.currentTarget.style.boxShadow = baseSt.boxShadow;
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(74,222,128,0.4), transparent)',
          opacity: D ? 0.6 : 0.4,
        }}
      />

      {gradient && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: D
              ? 'linear-gradient(135deg, transparent 60%, rgba(34,197,94,0.04))'
              : 'linear-gradient(135deg, transparent 60%, rgba(34,197,94,0.06))',
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;