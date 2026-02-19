import React from 'react';
import { motion } from 'framer-motion';

const GradientSlider = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  gradient = 'from-blue-500 to-green-500',
  marks = [],
  showValue = true,
  disabled = false,
  className = '',
  darkMode
}) => {
  const D = darkMode;
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e) => onChange(Number(e.target.value));

  const trackBg   = D ? '#111111' : '#e5e7eb';
  const thumbBg   = D ? '#0d0d0d' : '#ffffff';
  const labelClr  = D ? '#d1d5db' : '#374151';
  const valueBg   = D ? '#111111' : '#f3f4f6';
  const valueTxt  = D ? '#ffffff' : '#111827';
  const markClr   = D ? '#6b7280' : '#9ca3af';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium" style={{ color: labelClr }}>
            {label}
          </label>
          {showValue && (
            <span
              className="text-sm font-semibold px-2 py-1 rounded-lg tabular-nums"
              style={{ backgroundColor: valueBg, color: valueTxt }}
            >
              {value}
            </span>
          )}
        </div>
      )}

      {/* Slider track area — needs explicit height so absolute children appear */}
      <div className="relative" style={{ height: 20 }}>
        {/* Background track */}
        <div
          className={`absolute rounded-full`}
          style={{
            height: 8,
            width: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: trackBg,
          }}
        />

        {/* Filled portion */}
        <motion.div
          className={`absolute rounded-full bg-gradient-to-r ${gradient}`}
          style={{ height: 8, top: '50%', transform: 'translateY(-50%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.15 }}
        />

        {/* Native range (transparent, sits on top for interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute w-full opacity-0 cursor-pointer z-10"
          style={{ height: '100%', top: 0 }}
        />

        {/* Custom thumb */}
        <motion.div
          className="absolute rounded-full z-20 pointer-events-none"
          style={{
            width: 20,
            height: 20,
            left: `calc(${percentage}% - 10px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: thumbBg,
            border: '2.5px solid #22c55e',
            boxShadow: D ? '0 0 12px rgba(34,197,94,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
          }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.15 }}
        />
      </div>

      {/* Marks */}
      {marks.length > 0 && (
        <div className="flex justify-between mt-2 px-1">
          {marks.map((mark, i) => (
            <span key={i} className="text-xs" style={{ color: markClr }}>
              {mark}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GradientSlider;