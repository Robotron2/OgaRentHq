'use client'

import { stateMap } from './EscrowTimeline'
import { Address } from 'viem'
import { Info } from 'lucide-react'
import { useState } from 'react'
import DepositModal from './DepositModal'
import ConfirmOccupancyModal from './ConfirmOccupancyModal'
import RaiseDisputeModal from './RaiseDisputeModal'
import { useEscrowWrite } from '@/hooks/useEscrowWrite'
import { EscrowRole } from '@/lib/evm/roles'

interface ActionPanelProps {
  state: number | undefined
  role?: EscrowRole
  escrowAddress: Address
  totalAmount?: bigint
}

export default function EscrowActionPanel({ state, role = 'NONE', escrowAddress, totalAmount = 0n }: ActionPanelProps) {
  const stateStr = state !== undefined ? stateMap[state] : undefined
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isConfirmOccupancyModalOpen, setIsConfirmOccupancyModalOpen] = useState(false)
  const [isRaiseDisputeModalOpen, setIsRaiseDisputeModalOpen] = useState(false)
  
  const { executeAction, isTxPending: isClaimPending } = useEscrowWrite()

  let statusTitle = "Loading..."
  let ctaLabel = "Loading..."
  
  if (stateStr) {
    switch(stateStr) {
      case 'Created':
        statusTitle = "Ready for Deposit"
        ctaLabel = "Authorize & Lock Deposit"
        break
      case 'Funded':
        statusTitle = "Payment Secured"
        ctaLabel = "Confirm I've Received Keys"
        break
      case 'Occupied':
        statusTitle = "Lease Active"
        ctaLabel = "Lease in Progress"
        break
      case 'Disputed':
        statusTitle = "Under Review"
        ctaLabel = "Dispute Submitted"
        break
      case 'Completed':
        statusTitle = "Lease Completed"
        ctaLabel = "View Summary"
        break
    }
  }

  const isDisputed = stateStr === 'Disputed'

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 flex flex-col gap-6">
      <div className={`p-4 rounded-xl flex flex-col gap-2 ${isDisputed ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-primary text-on-primary'}`}>
        <span className="font-label-caps text-xs opacity-80">Current Status</span>
        <h2 className="font-headline-md">{statusTitle}</h2>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          disabled={role !== 'TENANT' || !stateStr || !['Created', 'Funded'].includes(stateStr)}
          onClick={() => {
            if (stateStr === 'Created') setIsDepositModalOpen(true)
            if (stateStr === 'Funded') setIsConfirmOccupancyModalOpen(true)
          }}
          className={`w-full py-4 rounded-lg font-label-caps font-bold transition-colors shadow-sm ${
            role === 'TENANT' && stateStr && ['Created', 'Funded'].includes(stateStr) 
              ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-primary/20' 
              : 'bg-outline-variant/50 text-outline cursor-not-allowed'
          }`}
        >
          {role !== 'TENANT' && stateStr === 'Created' ? 'Waiting for Tenant Deposit' : 
           role !== 'TENANT' && stateStr === 'Funded' ? 'Waiting for Tenant Confirmation' :
           ctaLabel}
        </button>

        {stateStr === 'Occupied' && role === 'TENANT' && (
          <button 
            onClick={() => executeAction(escrowAddress, 'claimCaution')}
            disabled={isClaimPending}
            className={`w-full py-4 rounded-lg font-label-caps font-bold transition-colors shadow-sm bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isClaimPending ? 'Claiming...' : 'Claim Caution Deposit'}
          </button>
        )}

        {stateStr && ['Funded', 'Occupied'].includes(stateStr) && (
          <button 
            onClick={() => setIsRaiseDisputeModalOpen(true)}
            className="w-full py-3 text-error font-body-md hover:bg-error-container/50 rounded-lg transition-colors underline text-sm"
          >
            Report an Issue
          </button>
        )}
      </div>

      <div className="mt-4 pt-6 border-t border-outline-variant/30">
        <div className="flex items-start gap-3 text-on-surface-variant text-sm">
          <Info size={16} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">Transaction Details</span>
            <span className="font-data-tabular opacity-80 break-all text-xs">
              Escrow: {escrowAddress}
            </span>
          </div>
        </div>
      </div>

      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        escrowAddress={escrowAddress} 
        totalAmount={totalAmount} 
      />

      <ConfirmOccupancyModal
        isOpen={isConfirmOccupancyModalOpen}
        onClose={() => setIsConfirmOccupancyModalOpen(false)}
        escrowAddress={escrowAddress}
      />

      <RaiseDisputeModal
        isOpen={isRaiseDisputeModalOpen}
        onClose={() => setIsRaiseDisputeModalOpen(false)}
        escrowAddress={escrowAddress}
      />
    </div>
  )
}
