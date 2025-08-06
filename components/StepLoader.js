'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function StepLoader({ setStep }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const stepFromURL = searchParams.get('step')
    if (stepFromURL === 'qr') {
      setStep('qr')
    }
  }, [searchParams, setStep])

  return null
}
