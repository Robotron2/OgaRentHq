export type AgreementFilter = 'All' | 'Active' | 'Occupied' | 'Disputed'

interface AgreementFiltersProps {
  currentFilter: AgreementFilter
  onFilterChange: (filter: AgreementFilter) => void
}

export default function AgreementFilters({ currentFilter, onFilterChange }: AgreementFiltersProps) {
  const filters: AgreementFilter[] = ['All', 'Active', 'Occupied', 'Disputed']

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide animate-in fade-in duration-500">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-5 py-2 rounded-full font-label-caps text-xs font-bold transition-all whitespace-nowrap ${
            currentFilter === filter 
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
