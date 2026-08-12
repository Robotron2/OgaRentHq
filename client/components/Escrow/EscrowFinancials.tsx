'use client'

import { Address } from 'viem'

import { EscrowRole } from '@/lib/evm/roles'

interface EscrowFinancialsProps {
  rentAmount: bigint | undefined
  agentFee: bigint | undefined
  cautionDeposit: bigint | undefined
  occupancyTimestamp: bigint | undefined
  role?: EscrowRole
}

const MUSDC_TO_NAIRA_RATE = 1500n

export function formatMusdcToNaira(amountInMusdc: bigint | undefined) {
  if (amountInMusdc === undefined) return '₦0'
  const amountInNaira = (amountInMusdc * MUSDC_TO_NAIRA_RATE) / 1_000_000n
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(amountInNaira))
}

export default function EscrowFinancials({ rentAmount, agentFee, cautionDeposit, occupancyTimestamp, role = 'NONE' }: EscrowFinancialsProps) {
  const total = (rentAmount || 0n) + (agentFee || 0n) + (cautionDeposit || 0n)

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col gap-6">
      <h3 className="font-headline-md text-primary">Financial Summary</h3>
      
      <div className="flex flex-col gap-4 font-data-tabular">
        <div className="flex justify-between items-center text-on-surface">
          <span className="text-on-surface-variant font-body-md flex items-center gap-2">
            Annual Rent
            {role === 'LANDLORD' && <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wider">You Receive</span>}
          </span>
          <span className="text-lg">{formatMusdcToNaira(rentAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-on-surface">
          <span className="text-on-surface-variant font-body-md flex items-center gap-2">
            Agent & Legal Fee
            {role === 'AGENT' && <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wider">You Receive</span>}
          </span>
          <span className="text-lg">{formatMusdcToNaira(agentFee)}</span>
        </div>
        <div className="flex justify-between items-center text-on-surface">
          <span className="text-on-surface-variant font-body-md flex items-center gap-2">
            Caution Deposit
            {role === 'TENANT' && <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Refundable to You</span>}
          </span>
          <span className="text-lg">{formatMusdcToNaira(cautionDeposit)}</span>
        </div>
        
        <div className="h-px w-full bg-outline-variant/30 my-2" />
        
        <div className="flex justify-between items-center text-primary font-bold">
          <span className="font-body-md">Total Secured</span>
          <span className="text-xl">{formatMusdcToNaira(total)}</span>
        </div>
      </div>
    </div>
  )
}
