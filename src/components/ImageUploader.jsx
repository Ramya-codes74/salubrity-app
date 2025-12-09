// src/components/ImageUploader.jsx
import React, { useRef } from 'react';

const toBase64 = (file) => new Promise((res, rej) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => res(reader.result);
  reader.onerror = (err) => rej(err);
});

const ImageUploader = ({ value, onChange, accept = 'image/*', capture = true }) => {
  // value: base64 string
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const b = await toBase64(file);
    onChange(b);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          {value ? <img src={value} alt="preview" className="w-full h-full object-cover" /> : <div className="text-sm text-gray-500">No image</div>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="px-3 py-2 bg-white border rounded cursor-pointer inline-block">
            <input ref={fileRef} type="file" accept={accept} capture={capture ? 'environment' : undefined} onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" />
            {capture ? 'Capture / Upload' : 'Upload image'}
          </label>

          {value && <button onClick={() => onChange(null)} className="px-3 py-2 border rounded text-sm">Remove</button>}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
