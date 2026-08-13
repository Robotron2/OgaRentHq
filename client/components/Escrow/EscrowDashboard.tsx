'use client'

import { useState, useEffect } from 'react'
import { Address } from 'viem'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { useUserEscrows } from '@/hooks/useFactory'
import EscrowList from './EscrowList/EscrowList'
import EscrowDetailView from './EscrowDetailView'
import CreateEscrowModal from './CreateEscrowModal'

export default function EscrowDashboard() {
  const { address } = useWallet()
  const { data: escrows, isLoading: isFactoryLoading } = useUserEscrows(address)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [selectedEscrow, setSelectedEscrow] = useState<Address | undefined>(undefined)

  useEffect(() => {
    const escrowParam = searchParams.get('escrow') as Address | null
    if (escrowParam && !selectedEscrow) {
      setSelectedEscrow(escrowParam)
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('escrow')
      const newUrl = `${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, selectedEscrow, router, pathname])
  
  if (isFactoryLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-body-md text-on-surface-variant">Discovering your escrows...</p>
      </div>
    )
  }

  // Placeholder for Phase 5
  const handleCreateNew = () => {
    // Will toggle create modal here
  }

  if (selectedEscrow) {
    return (
      <EscrowDetailView 
        escrowAddress={selectedEscrow} 
        onBack={() => setSelectedEscrow(undefined)} 
      />
    )
  }

  return (
    <div className="pb-20 relative">
      <EscrowList 
        escrows={escrows || []} 
        onSelect={(addr) => setSelectedEscrow(addr)}
      />
    </div>
  )
}
