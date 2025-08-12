'use client'
import { Suspense } from 'react'
import ScanClient from '@/components/ScanClient'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ScanClient />
    </Suspense>
  )
}