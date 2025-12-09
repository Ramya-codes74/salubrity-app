// src/components/Charts/Gauge.jsx
import React from 'react';

/**
 * Gauge - simple semicircle gauge 0..100
 * props:
 *  - value (0..100)
 *  - size (px)
 *  - thickness (px)
 *  - color (string)
 */
const Gauge = ({ value = 0, size = 120, thickness = 14, color = '#4f46e5', bg = '#e6e7eb' }) => {
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const dash = (clamped / 100) * circumference;
  const remaining = circumference - dash;
  return (
    <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
      {/* background arc */}
      <path
        d={describeArc(cx, cy, radius, 180, 0)}
        fill="none"
        stroke={bg}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      {/* foreground arc */}
      <path
        d={describeArc(cx, cy, radius, 180, 180 - (clamped / 100) * 180)}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      {/* center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{clamped}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6b7280">score</text>
    </svg>
  );
};

// helper to create an arc path (SVG) from startAngle to endAngle (degrees)
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
  return d;
}

export default Gauge;
