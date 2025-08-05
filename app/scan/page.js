'use client';

import React, { useState, useRef } from 'react';

export default function SkinScanPage() {
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const analyzeSkin = async () => {
    if (!imageData) return;
    setLoading(true);
    setResult(null);
    setProducts([]);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();
      setResult(data);

      const gender = data?.output?.gender;

      if (gender === 'female') {
        setProducts([
          { id: 1, name: 'Hydrating Serum' },
          { id: 2, name: 'Anti-Aging Cream' },
        ]);
      } else if (gender === 'male') {
        setProducts([
          { id: 3, name: 'Oil Control Gel' },
          { id: 4, name: 'Charcoal Cleanser' },
        ]);
      } else {
        setProducts([{ id: 5, name: 'Daily Moisturizer' }]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">AI Skin Analysis</h1>
      <p className="mb-4 text-gray-600">
        Choose how you'd like to provide your photo:
      </p>

      {/* CAMERA INPUT (TAKE PHOTO) */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        ref={cameraInputRef}
        className="hidden"
      />
      <button
        onClick={() => cameraInputRef.current.click()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-3 mr-3"
      >
        📷 Take Photo
      </button>

      {/* GALLERY INPUT (UPLOAD PHOTO) */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={galleryInputRef}
        className="hidden"
      />
      <button
        onClick={() => galleryInputRef.current.click()}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-3"
      >
        🖼️ Upload Photo
      </button>

      {imageData && (
        <div className="mb-4 mt-6">
          <img
            src={imageData}
            alt="Preview"
            className="w-48 mx-auto rounded shadow border"
          />
        </div>
      )}

      {imageData && (
        <button
          onClick={analyzeSkin}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mt-2"
        >
          {loading ? 'Analyzing...' : 'Analyze Skin'}
        </button>
      )}

      {result?.output && (
        <div className="mt-6 text-left">
          <h2 className="text-lg font-semibold mb-2">AI Analysis:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
            {JSON.stringify(result.output, null, 2)}
          </pre>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-6 text-left">
          <h2 className="text-lg font-semibold mb-2">Recommended Products:</h2>
          <ul className="list-disc ml-6">
            {products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
