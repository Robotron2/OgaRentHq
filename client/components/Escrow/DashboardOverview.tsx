import { EnrichedEscrow } from '@/hooks/useEscrow'
import { formatUnits } from 'viem'
import { Building2, CheckCircle2, AlertCircle, Wallet2 } from 'lucide-react'

interface DashboardOverviewProps {
  escrows: EnrichedEscrow[]
}

export default function DashboardOverview({ escrows }: DashboardOverviewProps) {
  const activeCount = escrows.filter(e => e.state !== undefined && e.state < 3).length
  const completedCount = escrows.filter(e => e.state === 4).length
  const disputedCount = escrows.filter(e => e.state === 3).length
  
  const totalVolume = escrows.reduce((acc, curr) => {
    if (curr.config) {
      return acc + curr.config.rentAmount
    }
    return acc
  }, 0n)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
      <StatCard 
        icon={<Building2 size={20} className="text-primary" />} 
        label="Active Agreements" 
        value={activeCount.toString()} 
        bgClass="bg-primary/5"
      />
      <StatCard 
        icon={<Wallet2 size={20} className="text-secondary" />} 
        label="Total Rent Volume" 
        value={`${formatUnits(totalVolume, 6)} mUSDC`} 
        bgClass="bg-secondary-container/30"
      />
      <StatCard 
        icon={<CheckCircle2 size={20} className="text-green-600" />} 
        label="Completed" 
        value={completedCount.toString()} 
        bgClass="bg-green-50"
      />
      <StatCard 
        icon={<AlertCircle size={20} className="text-error" />} 
        label="Disputed" 
        value={disputedCount.toString()} 
        bgClass="bg-error-container/30"
      />
    </div>
  )
}

function StatCard({ icon, label, value, bgClass }: { icon: React.ReactNode, label: string, value: string, bgClass: string }) {
  return (
    <div className={`p-5 rounded-2xl border border-outline-variant/30 flex flex-col gap-3 ${bgClass}`}>
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-label-caps text-xs text-on-surface-variant mb-1">{label}</p>
        <p className="font-display-sm text-on-surface font-semibold truncate">{value}</p>
      </div>
    </div>
  )
}
