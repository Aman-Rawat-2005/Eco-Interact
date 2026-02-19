import React from 'react';
import { motion } from 'framer-motion';
import { ecosystems } from '../../data/ecosystems';
import GlassCard from '../ui/GlassCard';

const EcosystemSelector = ({ selectedEco, onSelect, darkMode }) => {
  const D = darkMode;
  const entries = Object.entries(ecosystems);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {entries.map(([key, eco], index) => {
        const isSelected = selectedEco === key;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(key)}
            className="cursor-pointer"
          >
            <div
              className="relative rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: D ? '#0d0d0d' : '#ffffff',
                border: isSelected
                  ? '2px solid #22c55e'
                  : D
                    ? '2px solid rgba(255,255,255,0.08)'
                    : '2px solid #e5e7eb',
                boxShadow: isSelected
                  ? D ? '0 0 24px rgba(34,197,94,0.25)' : '0 0 24px rgba(34,197,94,0.18)'
                  : D ? '0 4px 20px rgba(0,0,0,0.9)' : '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              {/* Hero image */}
              <div
                className="h-32 sm:h-36 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${eco.heroImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-2 left-3 text-3xl sm:text-4xl drop-shadow-lg">
                  {eco.emoji}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#22c55e', boxShadow: '0 2px 8px rgba(34,197,94,0.5)' }}
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className="text-base sm:text-lg font-bold mb-1"
                  style={{ color: D ? '#ffffff' : '#111827' }}
                >
                  {eco.name}
                </h3>

                <p
                  className="text-xs sm:text-sm mb-3 leading-relaxed"
                  style={{ color: D ? '#9ca3af' : '#6b7280' }}
                >
                  {eco.description}
                </p>

                {/* Trophic level bars */}
                <div className="space-y-1.5 mb-3">
                  {eco.trophicLevels.map((level, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs w-4">{level.icon}</span>
                      <div
                        className="flex-1 rounded-full overflow-hidden"
                        style={{
                          height: 5,
                          backgroundColor: D ? '#1a1a1a' : '#e5e7eb',
                        }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: level.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - i * 28}%` }}
                          transition={{ delay: index * 0.08 + i * 0.04, duration: 0.5 }}
                        />
                      </div>
                      <span
                        className="text-xs w-10 text-right tabular-nums"
                        style={{ color: D ? '#6b7280' : '#9ca3af' }}
                      >
                        {level.organisms.length} spp.
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stats mini grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Biodiversity', val: eco.stats.biodiversity?.split(' ')[0] },
                    { label: 'Area', val: eco.stats.area },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-2"
                      style={{ backgroundColor: D ? '#111111' : '#f9fafb' }}
                    >
                      <span
                        className="block text-xs font-semibold"
                        style={{ color: D ? '#9ca3af' : '#6b7280' }}
                      >
                        {s.label}
                      </span>
                      <span className="text-xs font-bold text-green-500">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EcosystemSelector;