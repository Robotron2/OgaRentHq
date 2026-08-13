import { useState } from 'react'
import { EnrichedEscrow } from '@/hooks/useEscrow'
import AgreementCard from './AgreementCard'
import AgreementFilters, { AgreementFilter } from '../AgreementFilters'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

interface EscrowListProps {
  escrows: EnrichedEscrow[]
  onSelect: (address: string) => void
}

export default function EscrowList({ escrows, onSelect }: EscrowListProps) {
  const [filter, setFilter] = useState<AgreementFilter>('All')

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

  const filteredEscrows = escrows.filter(e => {
    if (filter === 'Active') return e.state !== undefined && e.state < 3
    if (filter === 'Occupied') return e.state === 2
    if (filter === 'Disputed') return e.state === 3
    return true
  })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-sm text-primary font-bold whitespace-nowrap">Other Agreements</h2>
          <div className="h-4 w-px bg-outline-variant/40 hidden sm:block" />
          <AgreementFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors font-medium text-sm shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} />
          New
        </Link>
      </div>
      
      {filteredEscrows.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant font-body-sm">
          No agreements match this filter.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredEscrows.map(escrow => (
            <AgreementCard 
              key={escrow.address} 
              escrow={escrow} 
              onClick={() => onSelect(escrow.address)} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
