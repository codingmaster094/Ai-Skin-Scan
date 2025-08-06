'use client'
import { useState } from 'react'
import ProductList from '@/components/ProductList'
import ResultCard from '@/components/ResultCard'
import StepLoader from '@/components/StepLoader'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
export default function Home() {
  const [step, setStep] = useState('landing') // landing, qr, analyze
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
const searchParams = useSearchParams()

useEffect(() => {
  const urlStep = searchParams.get('step')
  if (urlStep === 'qr') {
    setStep('qr')
  }
}, [])

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
      <Suspense>
        <StepLoader setStep={setStep} />
      </Suspense>
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
  <>
    {/* Check if on mobile or desktop */}
    {typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
      // ✅ MOBILE VIEW: Show upload options
      <div className="bg-black text-white p-6 rounded-2xl w-full max-w-md flex flex-col justify-between min-h-[90vh]">
        {/* Top Card */}
        <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
          <img
            src="/avatar.jpg"
            alt="How to take a great photo"
            className="w-16 h-16 rounded-md object-cover"
          />
          <div className="flex justify-between items-center w-full">
            <p className="font-medium text-sm sm:text-base">
              How to take a great photo
            </p>
            <span className="text-2xl">➡️</span>
          </div>
        </div>

        {/* Center Text */}
        <div className="text-center mt-12">
          <h2 className="text-lg sm:text-xl font-semibold">
            Select the capture option
          </h2>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-4 mt-auto">
          <label
            htmlFor="file-upload-camera"
            className="flex items-center justify-center gap-2 bg-white text-black w-full py-4 rounded-xl text-base font-medium cursor-pointer"
          >
            📷 Take a photo
          </label>
          <input
            id="file-upload-camera"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />

          <label
            htmlFor="file-upload-device"
            className="flex items-center justify-center gap-2 border border-white text-white w-full py-4 rounded-xl text-base font-medium cursor-pointer"
          >
            🖼️ Upload from device
          </label>
          <input
            id="file-upload-device"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>
    ) : (
      // ✅ DESKTOP VIEW: Show QR code
      <div className="bg-black text-white p-6 rounded-2xl w-full max-w-md text-center">
        <img
          src="/Qr.png"
          alt="QR Code"
          className="mx-auto rounded-md mb-6"
        />
        <h2 className="text-xl font-semibold mb-2">
          Scan this QR code to take a photo with your smartphone
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          The results will be shown here
        </p>

        <button
          className="w-full px-4 py-2 border border-gray-600 rounded-lg mb-3 text-gray-500 flex items-center justify-center cursor-not-allowed"
          disabled
        >
          <span className="mr-2">🖥</span> Continue on desktop
        </button>
      </div>
    )}
  </>
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
          <ResultCard conditions={result.conditions} />
          <ProductList products={result.products} />
        </div>
      )}
    </main>
  )
}
