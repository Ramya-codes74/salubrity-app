// src/shared/EmailPreviewModal.jsx
import React from 'react';

const EmailPreviewModal = ({ to, name, password, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 z-10 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">Invitation email preview</h3>
        <div className="border rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">To: <strong>{to}</strong></p>
          <p className="text-sm text-gray-600 mt-2">Hello {name},</p>
          <p className="text-sm text-gray-600 mt-2">
            You have been invited to the application. Use the temporary password below for first time login and change it after signing in.
          </p>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Temporary password</div>
            <div className="font-mono mt-1 text-lg">{password}</div>
          </div>

          <p className="text-sm text-gray-600 mt-4">Login link: <span className="text-blue-600">https://your-app.example/login</span></p>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;
