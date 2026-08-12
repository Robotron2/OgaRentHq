'use client'

import { useWallet } from '@/hooks/useWallet'
import { useTenantEscrows } from '@/hooks/useFactory'
import { useEscrowDetails } from '@/hooks/useEscrow'
import EscrowTimeline from './EscrowTimeline'
import EscrowFinancials from './EscrowFinancials'
import EscrowActionPanel from './EscrowActionPanel'
import Image from 'next/image'

export default function EscrowDashboard() {
  const { address } = useWallet()
  const { data: escrows, isLoading: isFactoryLoading } = useTenantEscrows(address)
  
  // Use the first escrow found, if any
  const activeEscrowAddress = escrows && escrows.length > 0 ? escrows[escrows.length - 1] : undefined
  
  const { config, state, occupancyTimestamp, isLoading: isEscrowLoading } = useEscrowDetails(activeEscrowAddress)
  const totalAmount = config ? (config.rentAmount + config.agentFee + config.cautionDeposit) : 0n

  if (isFactoryLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-body-md text-on-surface-variant">Loading your escrows...</p>
      </div>
    )
  }

  if (!activeEscrowAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 bg-white rounded-2xl border border-outline-variant/30 p-8 text-center max-w-lg mx-auto mt-12">
        <h2 className="font-headline-md text-primary">No Active Escrows</h2>
        <p className="font-body-md text-on-surface-variant">You don&apos;t have any active rental agreements on this wallet. Contact your landlord or agent to initiate one.</p>
      </div>
    )
  }

  if (isEscrowLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-body-md text-on-surface-variant">Loading escrow details...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="relative w-full h-[30vh] md:h-[40vh] rounded-3xl overflow-hidden shadow-md">
        <Image 
          src="/house1.png" 
          alt="Property" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="font-display-lg drop-shadow-md">Escrow Overview</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <EscrowTimeline currentState={state} />
          <EscrowFinancials 
            rentAmount={config?.rentAmount} 
            agentFee={config?.agentFee} 
            cautionDeposit={config?.cautionDeposit} 
            occupancyTimestamp={occupancyTimestamp} 
          />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <EscrowActionPanel state={state} escrowAddress={activeEscrowAddress} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  )
}
