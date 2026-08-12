'use client'

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'

export default function ConnectButton({ isMobile = false }: { isMobile?: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        className={`bg-primary text-on-primary font-label-caps text-sm font-bold rounded-lg transition-colors shadow-sm text-center opacity-50 cursor-wait ${isMobile ? 'w-full px-6 py-3 block' : 'px-6 py-3 inline-block'}`}
      >
        Loading...
      </div>
    )
  }

  return (
    <div className={isMobile ? 'w-full flex justify-center' : ''}>
      <RainbowConnectButton />
    </div>
  )
}
