'use client'

import { useWallet } from '@/hooks/useWallet'
import { AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NetworkGuard() {
  const { isConnected, isWrongNetwork, switchNetwork } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted || !isConnected || !isWrongNetwork) {
    return null
  }

  return (
    <div className="bg-tertiary-fixed-dim text-on-tertiary-fixed-variant px-4 py-3 flex items-center justify-center gap-3 w-full">
      <AlertCircle size={20} />
      <span className="font-body-md text-sm font-medium">
        You are connected to an unsupported network. Please switch to BOT Chain Testnet.
      </span>
      <button 
        onClick={switchNetwork}
        className="ml-2 font-label-caps text-xs font-bold underline hover:opacity-80 transition-opacity"
      >
        Switch Network
      </button>
    </div>
  )
}
