'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const router = useRouter()
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
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
    } catch (err) {
      alert('Analysis failed: ' + err.message)
    }
    setLoading(false)
  }

  if (result) {
    return (
      <main className="min-h-screen bg-white text-black p-6 max-w-md mx-auto text-left">
        <h2 className="text-xl font-semibold mb-4">Detected Conditions</h2>
        <ul className="list-disc pl-5 mb-6">
          {result.conditions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        <ul className="list-disc pl-5">
          {result.products.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Guide */}
      <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
        <img
          src="/avatar.png"
          alt="Guide"
          className="w-16 h-16 rounded-md object-cover"
        />
        <div className="flex justify-between items-center w-full">
          <p className="font-medium text-sm sm:text-base">
            How to take a great photo
          </p>
          <span className="text-2xl">➡️</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mt-12">
        <h2 className="text-lg sm:text-xl font-semibold">
          Select the capture option
        </h2>
      </div>

      {/* Buttons */}
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

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-48 h-48 object-cover rounded-lg border mx-auto mt-4"
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => router.push('/')}
            className="w-1/2 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!image || loading}
            className="w-1/2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  )
}
