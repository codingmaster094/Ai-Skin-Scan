'use client'
import { useState } from 'react'
import ProductList from '@/components/ProductList'
import ResultCard from '@/components/ResultCard'

export default function Home() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('welcome') // 'welcome', 'choose', 'analyze'
  const [captureMode, setCaptureMode] = useState(null)

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setStep('analyze')
  }

  const handleSubmit = async () => {
    if (!image) return alert('Please select or take a photo first.')
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">AI Skin Analyzer</h1>

      {/* Step 1: Welcome screen (shown after QR code) */}
      {step === 'welcome' && (
        <>
          <p className="text-lg mb-6">Welcome! Scan the QR code to analyze your skin condition.</p>
          <button
            onClick={() => setStep('choose')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </>
      )}

      {/* Step 2: Choose capture or upload */}
      {step === 'choose' && (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-lg mb-4">Please choose an option to start:</p>
          <div className="flex gap-4">
            <button
              onClick={() => setCaptureMode('camera')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Take Photo
            </button>
            <button
              onClick={() => setCaptureMode('upload')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Upload Photo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Image selection + preview */}
      {captureMode && step === 'choose' && (
        <div className="mt-6">
          <input
            type="file"
            accept="image/*"
            capture={captureMode === 'camera' ? 'environment' : undefined}
            onChange={handleFileInput}
            className="mb-4"
          />
        </div>
      )}

      {/* Step 4: Analyze preview */}
      {step === 'analyze' && preview && (
        <>
          <img
            src={preview}
            alt="preview"
            className="w-48 h-48 object-cover rounded-lg mb-4 border"
          />

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Skin'}
            </button>
            <button
              onClick={() => {
                setStep('choose')
                setCaptureMode(null)
                setImage(null)
                setPreview(null)
                setResult(null)
              }}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </>
      )}

      {/* Step 5: Results */}
      {result && (
        <div id="results" className="mt-10 w-full max-w-xl">
          <ResultCard conditions={result.conditions} />
          <ProductList products={result.products} />
        </div>
      )}
    </main>
  )
}
