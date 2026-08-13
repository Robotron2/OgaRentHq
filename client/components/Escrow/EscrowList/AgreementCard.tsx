import Image from 'next/image'
import { EnrichedEscrow } from '@/hooks/useEscrow'
import { formatUnits } from 'viem'
import { MapPin, ArrowRight } from 'lucide-react'

interface AgreementCardProps {
  escrow: EnrichedEscrow
  onClick: () => void
}

export default function AgreementCard({ escrow, onClick }: AgreementCardProps) {
  const property = escrow.property
  const states = ['Created', 'Funded', 'Occupied', 'Disputed', 'Completed']
  const stateStr = escrow.state !== undefined ? states[escrow.state] : 'Unknown'

  const getStateColors = (s: string) => {
    switch (s) {
      case 'Created': return 'bg-gray-100 text-gray-600'
      case 'Funded': return 'bg-blue-100 text-blue-700'
      case 'Occupied': return 'bg-primary/10 text-primary font-semibold'
      case 'Disputed': return 'bg-red-100 text-red-700 font-semibold'
      case 'Completed': return 'bg-green-100 text-green-700 font-semibold'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="relative h-40 md:h-auto md:w-40 shrink-0 bg-surface-container-low">
        <Image 
          src={property ? property.images[0] : "/house1.png"} 
          alt="Property" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <h3 className="font-headline-sm text-primary line-clamp-1">{property ? property.title : 'Rental Agreement'}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant">
              <MapPin size={14} />
              <span className="font-body-sm text-sm truncate">{property ? property.location : 'Lagos, Nigeria'}</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider shrink-0 ${getStateColors(stateStr)}`}>
            {stateStr}
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-outline-variant/20">
          <div>
            <span className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase tracking-wider block mb-0.5">Rent Amount</span>
            <span className="font-headline-sm text-on-surface font-semibold leading-none">
              {escrow.config ? formatUnits(escrow.config.rentAmount, 6) : '0'} mUSDC
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase tracking-wider block mb-1.5">Role: {escrow.role}</span>
            <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Details <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
