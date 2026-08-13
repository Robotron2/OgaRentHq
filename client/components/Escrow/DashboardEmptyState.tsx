import Link from 'next/link'
import { Plus, Home } from 'lucide-react'

export default function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 bg-white rounded-3xl border border-outline-variant/30 p-12 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-2 shadow-inner">
        <Home size={40} strokeWidth={1.5} />
      </div>
      <div>
        <h2 className="font-headline-lg text-primary tracking-tight mb-3">No Active Agreements Yet</h2>
        <p className="font-body-lg text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          You don't have any rental agreements in progress. Find a verified property you love and start the escrow process securely on-chain.
        </p>
      </div>
      <Link 
        href="/"
        className="bg-primary text-white font-label-caps font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mt-6 hover:-translate-y-0.5"
      >
        <Plus size={18} strokeWidth={2.5} />
        Browse Verified Properties
      </Link>
    </div>
  )
}
