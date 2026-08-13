import Link from 'next/link'
import { Search } from 'lucide-react'

interface DashboardHeaderProps {
  address?: string
}

export default function DashboardHeader({ address }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-display-lg text-primary tracking-tight">Your Rental Dashboard</h1>
        <p className="font-body-lg text-on-surface-variant mt-2 max-w-xl">
          Manage your active leases, track payments, and explore verified properties securely.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link 
          href="/"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-all font-label-caps font-bold text-sm shadow-md shadow-primary/20"
        >
          <Search size={18} />
          Browse Properties
        </Link>
      </div>
    </div>
  )
}
