'use client'

import { useWallet } from '@/hooks/useWallet'
import { ShieldCheck } from 'lucide-react'
import ConnectButton from './ConnectButton'
import { useEffect, useState } from 'react'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "ogarent"

interface WalletRequiredProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function WalletRequired({ 
  children, 
  title = "Secure Access Required", 
  description = "Please connect your wallet to securely view and manage your rental agreements."
}: WalletRequiredProps) {
  const { isConnected } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-50"></div>
      </div>
    )
  }

  if (isConnected) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center px-4 animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-2 shadow-sm">
        <ShieldCheck size={40} />
      </div>
      
      <div className="flex flex-col gap-3">
        <h2 className="font-headline-md text-primary font-bold">{title}</h2>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>

      <div className="w-full mt-6 flex justify-center">
        <ConnectButton isMobile={true} />
      </div>
    </div>
  )
}
