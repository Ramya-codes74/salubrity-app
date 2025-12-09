// src/components/Charts/PieChart.jsx
import React from 'react';

const PieChart = ({ data = [], size = 160 }) => {
  // data: [{label, value, color}]
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  let cumulative = 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const start = (cumulative / total) * Math.PI * 2;
        cumulative += Math.max(0, d.value);
        const end = (cumulative / total) * Math.PI * 2;
        const large = end - start > Math.PI ? 1 : 0;
        const x1 = cx + r * Math.cos(start);
        const y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end);
        const y2 = cy + r * Math.sin(end);
        const dAttr = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        return <path key={i} d={dAttr} fill={d.color || `hsl(${(i * 60) % 360}deg,60%,60%)`} />;
      })}
      {/* center circle for donut */}
      <circle cx={cx} cy={cy} r={r * 0.5} fill="#fff" />
    </svg>
  );
};

export default PieChart;
