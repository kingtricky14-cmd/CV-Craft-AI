import { useState, useRef } from 'react';

export default function ImageUploadCrop({ value, onChange }) {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage({ src: evt.target.result, width: img.width, height: img.height });
        setShowCropper(true);
        setCropStart(null);
        setCropEnd(null);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCropStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!cropStart || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCropEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    drawCropPreview();
  };

  const handleMouseUp = () => {
    // Keep the crop selection visible
  };

  const drawCropPreview = () => {
    if (!canvasRef.current || !originalImage || !cropStart || !cropEnd) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear the crop area
      const minX = Math.min(cropStart.x, cropEnd.x);
      const minY = Math.min(cropStart.y, cropEnd.y);
      const maxX = Math.max(cropStart.x, cropEnd.x);
      const maxY = Math.max(cropStart.y, cropEnd.y);
      ctx.clearRect(minX, minY, maxX - minX, maxY - minY);

      // Draw border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    };
    img.src = originalImage.src;
  };

  const handleCropConfirm = () => {
    if (!canvasRef.current || !originalImage || !cropStart || !cropEnd) return;

    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      // Get crop coordinates
      const minX = Math.min(cropStart.x, cropEnd.x);
      const minY = Math.min(cropStart.y, cropEnd.y);
      const maxX = Math.max(cropStart.x, cropEnd.x);
      const maxY = Math.max(cropStart.y, cropEnd.y);
      const size = Math.min(maxX - minX, maxY - minY);

      // Create circular crop
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = 200;
      cropCanvas.height = 200;
      const ctx = cropCanvas.getContext('2d');

      // Create circular mask
      ctx.beginPath();
      ctx.arc(100, 100, 100, 0, Math.PI * 2);
      ctx.clip();

      // Draw the cropped image
      ctx.drawImage(
        img,
        minX,
        minY,
        size,
        size,
        0,
        0,
        200,
        200
      );

      onChange(cropCanvas.toDataURL('image/jpeg', 0.9));
      setShowCropper(false);
      setOriginalImage(null);
    };
    img.src = originalImage.src;
  };

  const handleRemovePhoto = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {!showCropper && !value && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-brand-400 hover:bg-brand-50 transition"
          >
            <p className="text-sm font-medium text-gray-700">📸 Upload Photo</p>
            <p className="text-xs text-gray-500 mt-1">Click to select an image</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {showCropper && originalImage && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Crop Your Photo</label>
          <p className="text-xs text-gray-600">Click and drag to select the area you want</p>
          <canvas
            ref={canvasRef}
            width={originalImage.width}
            height={originalImage.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full border border-gray-300 rounded-lg cursor-crosshair"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowCropper(false)}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropConfirm}
              disabled={!cropEnd}
              className="px-3 py-1.5 text-sm rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Crop
            </button>
          </div>
        </div>
      )}

      {value && !showCropper && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={value}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-brand-300"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Change Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
