import Image from 'next/image'
import { EnrichedEscrow } from '@/hooks/useEscrow'
import { MapPin, ArrowRight, Check } from 'lucide-react'
import { formatUnits } from 'viem'

interface ActiveRentalCardProps {
  escrow: EnrichedEscrow
  onClick: () => void
}

export default function ActiveRentalCard({ escrow, onClick }: ActiveRentalCardProps) {
  const property = escrow.property
  const stateIndex = escrow.state ?? 0
  
  let actionText = "View Details"
  if (escrow.role === 'TENANT') {
    if (stateIndex === 0) actionText = "Continue Agreement"
    else if (stateIndex === 1) actionText = "Complete Escrow Agreement"
    else if (stateIndex === 2) actionText = "View Active Lease"
    else if (stateIndex === 3) actionText = "Review Dispute"
    else if (stateIndex === 4) actionText = "View Completed Agreement"
  } else {
    actionText = "Manage Agreement"
  }

  const visualIndex = Math.min(stateIndex, 2)
  const finalState = stateIndex === 3 ? 'Disputed' : stateIndex === 4 ? 'Completed' : 'Occupied'
  const displayStates = ['Created', 'Funded', finalState]

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      <h2 className="font-headline-md text-primary mb-4">Current Focus</h2>
      <div 
        className="bg-white rounded-3xl overflow-hidden border border-outline-variant/40 shadow-sm flex flex-col md:flex-row group cursor-pointer hover:shadow-md hover:border-primary/30 transition-all" 
        onClick={onClick}
      >
        
        {/* Image Section */}
        <div className="relative h-48 md:h-auto md:w-2/5 overflow-hidden">
          <Image 
            src={property ? property.images[0] : "/house1.png"} 
            alt="Property" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-display-sm drop-shadow-md line-clamp-1">{property ? property.title : 'Rental Property'}</h3>
            <div className="flex items-center gap-1.5 mt-1 opacity-90">
              <MapPin size={14} />
              <span className="font-body-sm truncate">{property ? property.location : 'Lagos, Nigeria'}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-label-caps text-on-surface-variant text-xs mb-1">Rent Amount</p>
              <p className="font-headline-md text-primary">{escrow.config ? formatUnits(escrow.config.rentAmount, 6) : '0'} mUSDC</p>
            </div>
            <div className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-mono opacity-60 flex items-center h-fit">
              {escrow.address.substring(0, 6)}...{escrow.address.substring(38)}
            </div>
          </div>

          {/* Minimal Timeline */}
          <div className="mb-8 relative pt-2">
            <div className="absolute top-4 left-4 right-4 h-1 bg-surface-container-highest -translate-y-1/2 z-0 rounded-full" />
            <div 
              className="absolute top-4 left-4 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
              style={{ width: `calc(${(visualIndex / 2)} * (100% - 2rem))` }}
            />
            <div className="flex justify-between relative z-10">
              {displayStates.map((stateName, idx) => {
                const isCompleted = idx <= visualIndex
                const isActive = idx === visualIndex
                const isDisputed = stateName === 'Disputed'
                return (
                  <div key={stateName} className="flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[1.5px] transition-colors ${
                        isDisputed ? 'bg-tertiary-fixed border-tertiary-fixed-dim text-on-tertiary-fixed-variant'
                        : isCompleted ? 'bg-primary border-primary text-white' 
                        : 'bg-white border-outline-variant text-transparent'
                      }`}
                    >
                      {isCompleted && !isDisputed ? <Check size={12} strokeWidth={3} /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-current' : 'bg-transparent'}`} />}
                    </div>
                    <span className={`font-label-caps text-[10px] ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant/70'}`}>
                      {stateName}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <button className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-xl font-label-caps font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
              {actionText}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
