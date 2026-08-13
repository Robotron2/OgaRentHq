import { Address } from 'viem'
import EscrowCard from './EscrowCard'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

interface EscrowListProps {
  escrows: readonly Address[]
  onSelect: (address: Address) => void
}

export default function EscrowList({ escrows, onSelect }: EscrowListProps) {
  if (escrows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 bg-white rounded-3xl border border-outline-variant/30 p-12 text-center max-w-2xl mx-auto mt-8 shadow-sm animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
          <FileText size={32} />
        </div>
        <div>
          <h2 className="font-headline-lg text-primary font-bold mb-2">No Active Agreements</h2>
          <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
            You don't have any active rental agreements yet. Find a property you love and start the escrow process securely.
          </p>
        </div>
        <Link 
          href="/"
          className="bg-primary text-white font-headline-sm px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center gap-2 mt-4"
        >
          <Plus size={20} />
          Browse Properties
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-lg text-primary font-bold">Your Agreements</h2>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full hover:bg-primary/20 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          New
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {escrows.map(address => (
          <EscrowCard 
            key={address} 
            escrowAddress={address} 
            onClick={() => onSelect(address)} 
          />
        ))}
      </div>
    </div>
  )
}
