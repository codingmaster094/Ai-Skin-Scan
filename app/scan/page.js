'use client'
import { useState } from 'react'
import ProductList from '@/components/ProductList'
import ResultCard from '@/components/ResultCard'

export default function Home() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!image) return alert('Please select an image')
    const formData = new FormData()
    formData.append('image', image)

    setLoading(true)
    const res = await fetch('/api/scan', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setResult(data)
setTimeout(() => {
  document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
}, 100)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Skin Analyzer</h1>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImage}
        className="mb-4"
      />

      {preview && (
        <img src={preview} alt="preview" className="w-48 h-48 object-cover rounded-lg mb-4 border" />
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Skin'}
      </button>

      {result && (
        <div id="results"  className="mt-8 w-full max-w-xl">
          <ResultCard conditions={result.conditions} />
          <ProductList products={result.products} />
        </div>
      )}
    </main>
  )
}
