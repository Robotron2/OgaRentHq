import { Address } from 'viem'
import { useEscrowDetails } from '@/hooks/useEscrow'
import { formatUnits } from 'viem'
import { Building2, ArrowRight } from 'lucide-react'
import { properties } from '@/data/properties'

interface EscrowCardProps {
  escrowAddress: Address
  onClick: () => void
}

export default function EscrowCard({ escrowAddress, onClick }: EscrowCardProps) {
  const { config, role, state, isLoading } = useEscrowDetails(escrowAddress)

  if (isLoading) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 h-48 animate-pulse flex flex-col justify-between">
        <div className="h-6 bg-outline-variant/20 rounded w-1/3"></div>
        <div className="h-4 bg-outline-variant/20 rounded w-1/2"></div>
      </div>
    )
  }

  if (!config) return null

  const states = ['Created', 'Funded', 'Occupied', 'Disputed', 'Completed']
  const stateStr = state !== undefined ? states[state] : 'Unknown'

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

  const property = properties.find(
    p => p.landlordAddress.toLowerCase() === config.landlord.toLowerCase() && p.rentAmount === config.rentAmount
  )

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <span className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase tracking-wider block">Your Role: {role}</span>
            <span className="font-body-md font-medium text-primary line-clamp-1">{property ? property.title : 'Rental Agreement'}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${getStateColors(stateStr)}`}>
          {stateStr}
        </div>
      </div>
      
      <div className="mt-2">
        <span className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase tracking-wider block mb-1">Rent Amount</span>
        <span className="font-headline-sm text-on-surface font-semibold">
          {formatUnits(config.rentAmount, 6)} mUSDC
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
        <span className="font-body-sm text-on-surface-variant truncate w-32 font-mono text-xs">
          {escrowAddress.substring(0, 6)}...{escrowAddress.substring(38)}
        </span>
        <div className="text-primary group-hover:translate-x-1 transition-transform">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  )
}
