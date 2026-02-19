import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHistoricalData } from '../../hooks/useHistoricalData';
import TimelineOverlay from '../charts/TimelineOverlay';
import GradientButton from '../ui/GradientButton';
import { Clock } from 'lucide-react';

const EcosystemTimeline = ({ ecosystem, darkMode, onYearChange }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const {
    historicalData,
    loading,
    selectedYear,
    setSelectedYear,
    getPopulationMultiplier
  } = useHistoricalData(ecosystem, 'IN');

  // Notify parent when year changes
  useEffect(() => {
    if (onYearChange && historicalData.length > 0) {
      const multiplier = getPopulationMultiplier(selectedYear);
      onYearChange(selectedYear, multiplier);
    }
  }, [selectedYear, historicalData, onYearChange, getPopulationMultiplier]);

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-4 left-4 z-30"
      >
        <GradientButton
          variant="primary"
          size="md"
          onClick={() => setShowOverlay(!showOverlay)}
          icon={<Clock size={18} />}
        >
          {showOverlay ? 'Hide Timeline' : 'Show 2000 Year History'}
        </GradientButton>
      </motion.div>

      {/* Overlay */}
      {showOverlay && (
        <TimelineOverlay
          historicalData={historicalData}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          darkMode={darkMode}
          loading={loading}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </>
  );
};

export default EcosystemTimeline;