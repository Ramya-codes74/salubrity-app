// src/components/Charts/SmallBar.jsx
import React from 'react';

const SmallBar = ({ value = 0, label = '', color = '#10b981', height = 10 }) => {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div>
      <div className="flex justify-between mb-1 text-xs text-gray-600">
        <div>{label}</div>
        <div>{v}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full" style={{ height }}>
        <div className="rounded-full" style={{ width: `${v}%`, height, background: color }} />
      </div>
    </div>
  );
};

export default SmallBar;
