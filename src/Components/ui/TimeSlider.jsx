import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const TimeSlider = ({ 
  year, 
  setYear, 
  minYear = 1900, 
  maxYear = 2024,
  darkMode,
  loading 
}) => {
  
  const eras = [
    { start: 1900, end: 1949, label: 'Pre-Industrial', color: '#9ca3af' },
    { start: 1950, end: 1999, label: 'Industrial', color: '#f97316' },
    { start: 2000, end: 2024, label: 'Modern', color: '#22c55e' }
  ];

  const currentEra = eras.find(era => year >= era.start && year <= era.end);

  return (
    <div className="w-full space-y-3">
      {/* Year Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-green-500" />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Selected Year:
          </span>
        </div>
        <motion.div
          key={year}
          initial={{ scale: 1.2, color: '#22c55e' }}
          animate={{ scale: 1, color: darkMode ? '#e5e7eb' : '#1f2937' }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => setYear(Math.max(minYear, year - 10))}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono font-bold text-xl">
            {year}
            {currentEra && (
              <span className="text-xs text-gray-400 ml-2">
                ({currentEra.label})
              </span>
            )}
          </span>
          <button
            onClick={() => setYear(Math.min(maxYear, year + 10))}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          step="10"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          disabled={loading}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-green-500"
          style={{
            background: `linear-gradient(to right, 
              #9ca3af 0%, 
              #9ca3af ${((1949 - minYear) / (maxYear - minYear)) * 100}%,
              #f97316 ${((1949 - minYear) / (maxYear - minYear)) * 100}%,
              #f97316 ${((1999 - minYear) / (maxYear - minYear)) * 100}%,
              #22c55e ${((1999 - minYear) / (maxYear - minYear)) * 100}%,
              #22c55e 100%)`
          }}
        />

        {/* Era Markers */}
        <div className="flex justify-between mt-1">
          {eras.map((era, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-gray-400" />
              <span className="text-xs text-gray-400 mt-1">{era.start}</span>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-2 bg-gray-400" />
            <span className="text-xs text-gray-400 mt-1">2024</span>
          </div>
        </div>
      </div>

      {/* Era Legend */}
      <div className="flex gap-3 justify-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span className="text-gray-400">Pre-Industrial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-400">Industrial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-400">Modern</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;