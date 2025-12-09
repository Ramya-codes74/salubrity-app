// src/components/Charts/BarChart.jsx
import React from 'react';

const BarChart = ({ items = [], height = 120 }) => {
  // items: [{label, value 0..100, color}]
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'end', height }}>
      {items.map((it, idx) => (
        <div key={idx} style={{ textAlign: 'center', width: 60 }}>
          <div style={{ height: `${(it.value / 100) * 100}%`, background: it.color || '#3b82f6', borderRadius: 6 }} title={`${it.label}: ${it.value}`} />
          <div style={{ marginTop: 6, fontSize: 12 }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
