'use client'
import { useState } from 'react'
import ProductList from '@/components/ProductList'
import ResultCard from '@/components/ResultCard'

export default function Home() {
  const [step, setStep] = useState('landing') // landing, qr, analyze
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setStep('analyze')
  }

  const handleSubmit = async () => {
    if (!image) return alert('Please select or take a photo first.')
    const formData = new FormData()
    formData.append('image', image)

    setLoading(true)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
    console.log("data" , data);
    
      if (data.error) throw new Error(data.error)
      setResult(data)
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      alert('Analysis failed: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-center">
      {/* Landing Screen */}
      {step === 'landing' && (
        <div className="w-full max-w-md" style={{position:"relative"}}>
          <img
            src="/homepage.jpg"
            alt="Landing"
            className="rounded-xl w-full object-cover"
          />
        <div className="p-6 bg-black/30 text-black rounded-xl" style={{width:"100%" , display:'flex' , justifyContent:"center" , alignItems:"center" , gap:"16px" , position:"absolute" , bottom:"10px"}}>
          <img src="/start.svg" alt="Landing" className="w-20 h-20" />
          <button
            onClick={() => setStep('qr')}
            className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100"
          > 
            Start analysis
          </button>
        </div>

        </div>
      )}

      {/* QR Code Screen */}
      {step === 'qr' && (
        <div className="bg-black text-white p-6 rounded-2xl w-full max-w-md text-center">
          <img
            src="/Qr.png"
            alt="QR Code"
            className="mx-auto rounded-md mb-6"
          />
          <h2 className="text-xl font-semibold mb-2">
            Scan this QR code to take a photo with your smartphone
          </h2>
          <p className="text-sm text-gray-400 mb-6">The results will be shown here</p>

          <button
            className="w-full px-4 py-2 border border-gray-600 rounded-lg mb-3 text-gray-500 flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <span className="mr-2">🖥</span> Continue on desktop
          </button>

          <label
            htmlFor="file-upload"
            className="w-full px-4 py-2 border border-white rounded-lg cursor-pointer hover:bg-white hover:text-black transition"
          >
            <span className="mr-2">📁</span> Upload from device
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* Analyze & Result Preview */}
      {step === 'analyze' && (
        <>
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-48 h-48 object-cover rounded-lg mb-4 border"
            />
          )}
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
                setStep('qr')
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

      {/* Results */}
      {result && (
      <div id="results" className="mt-10 w-full max-w-xl">
        <ResultCard conditions={result.analysis} products={result.recommendations}/>
        {/* <ProductList products={result.recommendations} /> */}
      </div>
)}
    </main>
  )
}
