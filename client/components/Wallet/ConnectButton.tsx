'use client'

import { useWallet } from '@/hooks/useWallet'
import { useState } from 'react'

export default function ConnectButton({ isMobile = false }: { isMobile?: boolean }) {
  const { address, isConnected, isWrongNetwork, connect, disconnect, switchNetwork } = useWallet()
  const [showPopover, setShowPopover] = useState(false)

  if (!isConnected) {
    return (
      <button 
        onClick={connect}
        className={`bg-primary text-on-primary font-label-caps text-sm font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm text-center cursor-pointer ${isMobile ? 'w-full px-6 py-3 block' : 'px-6 py-3 inline-block'}`}
      >
        Connect Wallet
      </button>
    )
  }

  if (isWrongNetwork) {
    return (
      <button 
        onClick={switchNetwork}
        className={`bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-sm font-bold rounded-lg hover:bg-tertiary-fixed-dim transition-colors ${isMobile ? 'w-full px-6 py-3 block text-center' : 'px-4 py-2.5'}`}
      >
        Switch Network
      </button>
    )
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className={`relative ${isMobile ? 'w-full' : ''}`}>
      <button 
        onClick={() => setShowPopover(!showPopover)}
        className={`bg-surface-container-low text-on-surface font-data-tabular text-sm rounded-full border border-outline-variant/30 hover:shadow-md transition-shadow flex items-center justify-center gap-2 ${isMobile ? 'w-full px-6 py-3' : 'px-4 py-2'}`}
      >
        <div className="w-2 h-2 rounded-full bg-primary" />
        {address ? truncateAddress(address) : ''}
      </button>

      {showPopover && (
        <div className={`absolute mt-2 bg-white rounded-xl shadow-lg border border-outline-variant/30 p-2 z-50 ${isMobile ? 'w-full bottom-[110%]' : 'right-0 w-48'}`}>
          <button
            onClick={() => {
              disconnect()
              setShowPopover(false)
            }}
            className="w-full text-left px-4 py-2 text-sm font-bold text-error hover:bg-error-container/50 rounded-lg transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  )
}
