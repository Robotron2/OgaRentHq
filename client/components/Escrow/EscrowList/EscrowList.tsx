import { Address } from 'viem'
import EscrowCard from './EscrowCard'
import { Plus } from 'lucide-react'

interface EscrowListProps {
  escrows: readonly Address[]
  onSelect: (address: Address) => void
  onCreateNew: () => void
}

export default function EscrowList({ escrows, onSelect, onCreateNew }: EscrowListProps) {
  if (escrows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 bg-white rounded-3xl border border-outline-variant/30 p-8 text-center max-w-lg mx-auto mt-12 shadow-sm animate-in fade-in duration-300">
        <h2 className="font-headline-md text-primary font-bold">No Active Agreements</h2>
        <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">You don&apos;t have any active rental agreements on this wallet. Create one to get started.</p>
        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Plus size={20} />
          Create Agreement
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-lg text-primary font-bold">Your Agreements</h2>
        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full hover:bg-primary/20 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          New
        </button>
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
