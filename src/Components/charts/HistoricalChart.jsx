import React from 'react';
import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const HistoricalChart = ({ data, darkMode, height = 300, onYearHover }) => {
  const D = darkMode;

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          height,
          backgroundColor: D ? '#0d0d0d' : '#f9fafb',
          border: D ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb',
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p style={{ color: D ? '#6b7280' : '#9ca3af', fontSize: 14 }}>No historical data available</p>
          <p style={{ color: D ? '#4b5563' : '#d1d5db', fontSize: 12, marginTop: 4 }}>
            Using simulated data for demonstration
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    if (onYearHover) onYearHover(parseInt(label));
    return (
      <div
        className="px-3 py-2.5 rounded-xl text-xs"
        style={{
          backgroundColor: '#000000',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,1)',
          color: '#f3f4f6',
        }}
      >
        <p className="font-bold mb-2 text-green-400">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span style={{ color: '#9ca3af' }}>{entry.name}:</span>
            <span className="font-mono font-bold" style={{ color: entry.color }}>
              {entry.value.toFixed(1)}{entry.name === 'Forest Cover' ? '%' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const gridColor   = D ? 'rgba(255,255,255,0.06)' : '#e5e7eb';
  const axisColor   = D ? '#4b5563' : '#9ca3af';
  const tickStyle   = { fill: D ? '#6b7280' : '#9ca3af', fontSize: 11 };
  const labelStyle  = { fill: D ? '#6b7280' : '#9ca3af', fontSize: 10 };
  const legendStyle = { color: D ? '#d1d5db' : '#374151', fontSize: 12 };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div
        className="rounded-xl overflow-hidden p-2"
        style={{ backgroundColor: D ? '#000000' : 'transparent' }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

            <XAxis
              dataKey="year"
              stroke={axisColor}
              tick={tickStyle}
              tickLine={{ stroke: axisColor }}
            />

            <YAxis
              yAxisId="left"
              stroke={axisColor}
              tick={tickStyle}
              tickLine={{ stroke: axisColor }}
              label={{
                value: 'Population (thousands)',
                angle: -90,
                position: 'insideLeft',
                style: labelStyle,
                offset: -5,
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={axisColor}
              tick={tickStyle}
              tickLine={{ stroke: axisColor }}
              label={{
                value: 'Forest Cover %',
                angle: 90,
                position: 'insideRight',
                style: labelStyle,
                offset: -5,
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={legendStyle} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="population"
              name="Population"
              stroke="#22c55e"
              fill={D ? 'rgba(34,197,94,0.10)' : 'rgba(34,197,94,0.12)'}
              strokeWidth={2.5}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="forestArea"
              name="Forest Cover"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="biodiversity"
              name="Biodiversity Index"
              stroke="#eab308"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#eab308', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HistoricalChart;