'use client'

import { Address } from 'viem'
import { useEscrowDetails } from '@/hooks/useEscrow'
import EscrowTimeline from './EscrowTimeline'
import EscrowFinancials from './EscrowFinancials'
import EscrowActionPanel from './EscrowActionPanel'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { properties } from '@/data/properties'

interface EscrowDetailViewProps {
  escrowAddress: Address
  onBack: () => void
}

export default function EscrowDetailView({ escrowAddress, onBack }: EscrowDetailViewProps) {
  const { config, role, state, occupancyTimestamp, isLoading } = useEscrowDetails(escrowAddress)
  const totalAmount = config ? (config.rentAmount + config.agentFee + config.cautionDeposit) : 0n

  const property = config 
    ? properties.find(p => p.landlordAddress.toLowerCase() === config.landlord.toLowerCase() && p.rentAmount === config.rentAmount) 
    : undefined

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-body-md text-on-surface-variant">Loading escrow details...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors w-fit bg-white px-4 py-2 rounded-full shadow-sm border border-outline-variant/20"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm">Back to Agreements</span>
      </button>

      <div className="relative w-full h-[30vh] md:h-[40vh] rounded-3xl overflow-hidden shadow-md border border-outline-variant/30">
        <Image 
          src={property ? property.images[0] : "/house1.png"} 
          alt="Property" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
          <h1 className="font-display-lg drop-shadow-md text-white">{property ? property.title : 'Agreement Details'}</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-mono text-xs opacity-90 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/20 shadow-sm">{escrowAddress}</p>
            {property && <span className="text-xs bg-primary text-white px-3 py-1 rounded-full shadow-sm font-bold tracking-wider">VERIFIED PROPERTY</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <EscrowTimeline currentState={state} />
          <EscrowFinancials 
            rentAmount={config?.rentAmount} 
            agentFee={config?.agentFee} 
            cautionDeposit={config?.cautionDeposit} 
            occupancyTimestamp={occupancyTimestamp} 
            role={role}
          />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-32 z-10">
            <EscrowActionPanel state={state} role={role} escrowAddress={escrowAddress} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  )
}
