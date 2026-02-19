import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import HistoricalChart from './HistoricalChart';
import TimeSlider from '../ui/TimeSlider';

const TimelineOverlay = ({
  historicalData,
  selectedYear,
  setSelectedYear,
  darkMode,
  loading,
  onClose,
  onToggleEnergyAdjust
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [adjustEnergy, setAdjustEnergy] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: expanded ? 1.1 : 1,
        width: expanded ? '90%' : '50%'
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`absolute top-4 right-4 z-40 rounded-xl shadow-2xl overflow-hidden
        ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}
        backdrop-blur-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      style={{ width: expanded ? '90%' : '50%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">📈</span>
          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Historical Timeline (1900-2024)
          </h4>
          {loading && (
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setAdjustEnergy(!adjustEnergy)}
            className={`p-1.5 rounded-lg transition-colors ${
              adjustEnergy 
                ? 'bg-green-500 text-white' 
                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Adjust energy diagram based on year"
          >
            {adjustEnergy ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1.5 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <TimeSlider
          year={selectedYear}
          setYear={setSelectedYear}
          darkMode={darkMode}
          loading={loading}
          minYear={1900}
          maxYear={2024}
        />

        <div className="mt-4">
          <HistoricalChart
            data={historicalData}
            darkMode={darkMode}
            height={expanded ? 350 : 250}
          />
        </div>

        {/* Year Stats */}
        {historicalData.length > 0 && (
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-3 p-2 rounded-lg text-sm ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Year {selectedYear}:</span>
              <span className="font-mono text-green-500">
                Population: {historicalData.find(d => d.year === selectedYear)?.population?.toLocaleString() || 'N/A'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineOverlay;