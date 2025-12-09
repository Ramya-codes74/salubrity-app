// src/shared/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ title = 'Confirm', body, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{body}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 border rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 bg-red-600 text-white rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
