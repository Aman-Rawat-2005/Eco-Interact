import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EnergyChart = ({ data, darkMode, height = 200 }) => {
  const canvasRef = useRef(null);
  const D = darkMode;

  useEffect(() => {
    if (!data || data.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 15, right: 20, bottom: 28, left: 50 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;

    // Find max
    let maxV = 0;
    data.forEach(p => { maxV = Math.max(maxV, p.producer || 0, p.primary || 0, p.secondary || 0, p.tertiary || 0); });
    maxV = maxV * 1.1 || 10000;

    const sY = v => pad.top + cH - (v / maxV) * cH;
    const sX = i => pad.left + (i / Math.max(data.length - 1, 1)) * cW;

    // Background fill (absolute black in dark mode)
    ctx.fillStyle = D ? '#000000' : '#f9fafb';
    ctx.roundRect(0, 0, W, H, 8);
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = D ? 'rgba(255,255,255,0.06)' : '#e5e7eb';
    ctx.lineWidth = 0.8;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i * cH / 4);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = D ? 'rgba(255,255,255,0.2)' : '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, H - pad.bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.left, H - pad.bottom); ctx.lineTo(W - pad.right, H - pad.bottom); ctx.stroke();

    // Lines
    const lines = [
      { key: 'producer',  color: '#22c55e' },
      { key: 'primary',   color: '#eab308' },
      { key: 'secondary', color: '#f97316' },
      { key: 'tertiary',  color: '#ef4444' },
    ];

    lines.forEach(({ key, color }) => {
      if (!data.some(p => p[key] !== undefined)) return;

      // Subtle glow in dark mode
      if (D) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      data.forEach((p, i) => {
        if (p[key] === undefined) return;
        const x = sX(i), y = sY(p[key]);
        first ? (ctx.moveTo(x, y), first = false) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Dots
      data.forEach((p, i) => {
        if (p[key] === undefined) return;
        const x = sX(i), y = sY(p[key]);
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = D ? '#000000' : '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
      });
    });

    // X-axis labels
    ctx.fillStyle = D ? '#6b7280' : '#9ca3af';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    data.forEach((p, i) => {
      if (i % 3 === 0 || i === data.length - 1) {
        const x = sX(i);
        let lbl = p.time ? `${new Date(p.time).getHours()}:${new Date(p.time).getMinutes().toString().padStart(2,'0')}` : `${data.length - i}s`;
        ctx.fillText(lbl, x, H - pad.bottom + 12);
      }
    });

    // Y-axis labels
    ctx.fillStyle = D ? '#6b7280' : '#9ca3af';
    ctx.font = '8px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i * cH / 4);
      const v = Math.round(maxV - (i * maxV / 4));
      ctx.fillText(v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v, pad.left - 5, y + 3);
    }
  }, [data, darkMode]);

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ height, backgroundColor: D ? '#0d0d0d' : '#f9fafb', border: D ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb' }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p style={{ color: D ? '#6b7280' : '#9ca3af' }}>Adjust energy slider to see data</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <canvas ref={canvasRef} width={600} height={height} className="w-full rounded-xl" style={{ maxWidth: '100%', display: 'block' }} />

      {/* Legend */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { key: 'producer',  label: 'Producers',  color: '#22c55e', bg: D ? 'rgba(34,197,94,0.08)' : '#f0fdf4' },
          { key: 'primary',   label: 'Primary',    color: '#eab308', bg: D ? 'rgba(234,179,8,0.08)'  : '#fefce8' },
          { key: 'secondary', label: 'Secondary',  color: '#f97316', bg: D ? 'rgba(249,115,22,0.08)' : '#fff7ed' },
          { key: 'tertiary',  label: 'Tertiary',   color: '#ef4444', bg: D ? 'rgba(239,68,68,0.08)'  : '#fef2f2' },
        ].map(({ key, label, color, bg }) => (
          <div key={key} className="flex items-center gap-1.5 p-2 rounded-lg" style={{ backgroundColor: bg }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="font-medium truncate" style={{ color: D ? '#d1d5db' : '#374151' }}>{label}</span>
            <span className="ml-auto font-mono tabular-nums" style={{ color }}>
              {Math.round(data[data.length - 1]?.[key] || 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <span className="inline-block text-xs px-3 py-1 rounded-full"
          style={{ backgroundColor: D ? '#111111' : '#f3f4f6', color: D ? '#9ca3af' : '#6b7280' }}>
          ⚡ 10% Energy Transfer Between Levels
        </span>
      </div>
    </motion.div>
  );
};

export default EnergyChart;