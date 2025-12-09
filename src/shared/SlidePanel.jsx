// src/shared/SlidePanel.jsx
import React from 'react';

const SlidePanel = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[380px] bg-white dark:bg-gray-900 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default SlidePanel;
