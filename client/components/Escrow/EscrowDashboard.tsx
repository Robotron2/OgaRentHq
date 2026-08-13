'use client'

import { useState } from 'react'
import { Address } from 'viem'
import { useWallet } from '@/hooks/useWallet'
import { useUserEscrows } from '@/hooks/useFactory'
import EscrowList from './EscrowList/EscrowList'
import EscrowDetailView from './EscrowDetailView'
import CreateEscrowModal from './CreateEscrowModal'

export default function EscrowDashboard() {
  const { address } = useWallet()
  const { data: escrows, isLoading: isFactoryLoading } = useUserEscrows(address)
  
  const [selectedEscrow, setSelectedEscrow] = useState<Address | undefined>(undefined)
  
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
