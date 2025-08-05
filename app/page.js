'use client';

import React, { useState } from 'react';

export default function Home() {
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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

      // Recommend based on gender or age
      const gender = data?.output?.gender;
      const age = data?.output?.age;

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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Skin Analysis</h1>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {imageData && (
        <div className="mb-4">
          <img src={imageData} alt="Preview" className="w-48 rounded shadow" />
        </div>
      )}

      <button
        onClick={analyzeSkin}
        disabled={!imageData || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Skin'}
      </button>

      {result?.output && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
            {JSON.stringify(result.output, null, 2)}
          </pre>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Recommended Products:</h2>
          <ul className="list-disc ml-5">
            {products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
