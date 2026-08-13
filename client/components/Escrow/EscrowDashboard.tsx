'use client'

import { useState, useEffect } from 'react'
import { Address } from 'viem'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { useUserEscrows } from '@/hooks/useFactory'
import { useMultipleEscrowDetails } from '@/hooks/useEscrow'
import EscrowList from './EscrowList/EscrowList'
import EscrowDetailView from './EscrowDetailView'
import DashboardHeader from './DashboardHeader'
import DashboardOverview from './DashboardOverview'
import ActiveRentalCard from './ActiveRentalCard'
import DashboardSkeleton from './DashboardSkeleton'
import DashboardEmptyState from './DashboardEmptyState'

export default function EscrowDashboard() {
  const { address } = useWallet()
  const { data: escrowAddresses, isLoading: isFactoryLoading } = useUserEscrows(address)
  
  const { escrows, isLoading: isDetailsLoading } = useMultipleEscrowDetails(escrowAddresses || [])
  const isLoading = isFactoryLoading || (escrowAddresses && escrowAddresses.length > 0 && isDetailsLoading)
  
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
  
  if (isLoading) {
    return <DashboardSkeleton />
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

  const activeEscrow = escrows.find(e => e.state !== undefined && e.state < 3 && e.role !== 'NONE') || (escrows.length > 0 ? escrows[0] : undefined)
  const remainingEscrows = escrows.filter(e => e.address !== activeEscrow?.address)

  if (escrows.length === 0 && !selectedEscrow) {
    return (
      <div className="pb-20 relative max-w-6xl mx-auto">
        <DashboardHeader address={address} />
        <DashboardEmptyState />
      </div>
    )
  }

  return (
    <div className="pb-20 relative max-w-6xl mx-auto">
      <DashboardHeader address={address} />
      
      {escrows.length > 0 && (
        <DashboardOverview escrows={escrows} />
      )}

      {activeEscrow && (
        <ActiveRentalCard 
          escrow={activeEscrow} 
          onClick={() => setSelectedEscrow(activeEscrow.address)} 
        />
      )}

      {remainingEscrows.length > 0 && (
        <EscrowList 
          escrows={remainingEscrows} 
          onSelect={(addr) => setSelectedEscrow(addr as Address)}
        />
      )}
    </div>
  )
}
