// src/components/Charts/RadarChart.jsx
import React from 'react';

/**
 * RadarChart
 * props:
 *  - data: [{label, value 0..100}]
 *  - size: px
 */
const RadarChart = ({ data = [], size = 220, levels = 4, color = '#06b6d4' }) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const count = data.length || 1;

  const angle = (i) => (Math.PI * 2 * i) / count - Math.PI / 2;

  // grid polygons
  const grid = [];
  for (let l = 1; l <= levels; l++) {
    const r = (radius * l) / levels;
    const pts = data.map((_, i) => {
      const x = cx + r * Math.cos(angle(i));
      const y = cy + r * Math.sin(angle(i));
      return `${x},${y}`;
    }).join(' ');
    grid.push(<polygon key={l} points={pts} fill="none" stroke="#e6e7eb" strokeWidth="1" />);
  }

  // axes labels
  const labels = data.map((d, i) => {
    const x = cx + (radius + 12) * Math.cos(angle(i));
    const y = cy + (radius + 12) * Math.sin(angle(i));
    return <text key={i} x={x} y={y} fontSize="11" fill="#374151" textAnchor={Math.cos(angle(i)) > 0.1 ? 'start' : Math.cos(angle(i)) < -0.1 ? 'end' : 'middle'} dominantBaseline="middle">{d.label}</text>;
  });

  // data polygon
  const pts = data.map((d, i) => {
    const v = Math.max(0, Math.min(100, d.value || 0)) / 100;
    const x = cx + radius * v * Math.cos(angle(i));
    const y = cy + radius * v * Math.sin(angle(i));
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>{grid}</g>
      {/* polygon fill */}
      <polygon points={pts} fill={hexToRgbA(color, 0.18)} stroke={color} strokeWidth="2" />
      {labels}
    </svg>
  );
};

function hexToRgbA(hex, alpha) {
  // simple hex -> rgba
  if (!hex) hex = '#06b6d4';
  const h = hex.replace('#','');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default RadarChart;
