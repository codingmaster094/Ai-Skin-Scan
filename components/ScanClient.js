'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function ScanClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('id')

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch results if sessionId exists
  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    fetch(`/api/scan?id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [sessionId])

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!image) return alert('Please select or take a photo first.')

    // If no sessionId, generate a new one and update URL
    const newSessionId = sessionId || generateUUID()
    if (!sessionId) {
      router.push(`/scan?id=${newSessionId}`)
    }

    const formData = new FormData()
    formData.append('image', image)

    setLoading(true)
    try {
      const res = await fetch(`/api/scan?id=${newSessionId}`, {
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

  if (loading) return <p className="p-4 text-center">Loading...</p>

  if (result) {
    return (
      <main className="min-h-screen bg-white text-black p-4 max-w-md mx-auto text-left font-sans">
        {/* Header Cards */}
        <div className="overflow-x-auto whitespace-nowrap px-2">
          <div className="flex g-3 space-x-4">
            {result.analysis.map((c, i) => (
              <div
                key={i}
                className="min-w-[200px] bg-white border rounded-xl shadow-md p-3 text-center"
              >
                <div className="text-md font-medium text-gray-800">{c.name}</div>
                {c.score !== null && (
                  <div className="text-sm text-orange-600 font-semibold mt-1">{c.score} / 100</div>
                )}
                <div className="text-sm text-gray-500 mt-1">{c.status}</div>
                <button className="mt-2 text-blue-600 text-sm font-medium">Show more</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <h2 className="text-lg font-semibold mb-3">Recommendations for you</h2>
        <div className="space-y-4">
          <div className="recommendation-grid">
            {result.recommendations.map((p, i) => {
              const rating = p.product.rating || 0
              const fullStars = Math.floor(rating)
              const halfStar = rating % 1 >= 0.5
              const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
              return (
                <div key={i} className="bg-blue-50 rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-sm text-blue-800 mb-1">{p.stepTitle}</h3>
                  <p className="text-xs text-gray-600 mb-3">{p.description}</p>
                  <div className="card">
                    <img src={p.product.image} alt={p.product.name} width={150} height={100} />
                    <div className="card-content">
                      <h3 className="card-title">{p.product.name}</h3>
                      <div className="price">${p.product.price}</div>
                      🕒 {p.product.timeOfDay}
                      <div className="rating">
                        {Array(fullStars)
                          .fill('★')
                          .map((star, idx) => (
                            <span key={`full-${idx}`}>{star}</span>
                          ))}
                        {halfStar && <span>★</span>}
                        {Array(emptyStars)
                          .fill('☆')
                          .map((star, idx) => (
                            <span key={`empty-${idx}`}>{star}</span>
                          ))}
                        <span className="text-gray-600 text-sm ml-1">({rating})</span>
                      </div>
                      <a href="#" className="button">
                        Add to Cart
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Optional: maybe refetch recommendations or reset UI
            }}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            🔍 RECOMMENDATIONS FOR YOU
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Guide */}
      <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
        <img src="/avatar.png" alt="Guide" className="w-16 h-16 rounded-md object-cover" />
        <div className="flex justify-between items-center w-full">
          <p className="font-medium text-sm sm:text-base">How to take a great photo</p>
          <span className="text-2xl">➡️</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mt-12">
        <h2 className="text-lg sm:text-xl font-semibold">Select the capture option</h2>
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
