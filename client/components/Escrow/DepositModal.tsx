'use client'

import { useState, useEffect } from 'react'
import { Address } from 'viem'
import { useWallet } from '@/hooks/useWallet'
import { useTokenAllowance, useTokenApprove } from '@/hooks/useToken'
import { useEscrowWrite } from '@/hooks/useEscrowWrite'
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatMusdcToNaira } from './EscrowFinancials'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  escrowAddress: Address
  totalAmount: bigint
}

export default function DepositModal({ isOpen, onClose, escrowAddress, totalAmount }: DepositModalProps) {
  const { address } = useWallet()
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(address, escrowAddress)
  
  const { 
    approve, 
    isConfirming: isApproveConfirming, 
    isTxPending: isApprovePending, 
    isTxSuccess: isApproveSuccess,
    error: approveError,
    reset: resetApprove
  } = useTokenApprove()

  const {
    executeAction,
    isConfirming: isDepositConfirming,
    isTxPending: isDepositPending,
    isTxSuccess: isDepositSuccess,
    error: depositError,
    reset: resetDeposit
  } = useEscrowWrite()

  const [step, setStep] = useState<1 | 2>(1)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetApprove()
      resetDeposit()
      refetchAllowance()
    }
  }, [isOpen])

  // Automatically advance to step 2 if allowance is sufficient or approve succeeds
  useEffect(() => {
    if (isOpen && allowance !== undefined && totalAmount > 0n) {
      if (allowance >= totalAmount || isApproveSuccess) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(2)
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(1)
      }
    }
  }, [isOpen, allowance, totalAmount, isApproveSuccess])

  // Auto-close on deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      const timer = setTimeout(() => onClose(), 3000)
      return () => clearTimeout(timer)
    }
  }, [isDepositSuccess, onClose])

  if (!isOpen) return null

  const handleApprove = () => {
    if (totalAmount) approve(escrowAddress, totalAmount)
  }

  const handleDeposit = () => {
    executeAction(escrowAddress, 'deposit')
  }

  const isApproveLoading = isApproveConfirming || isApprovePending
  const isDepositLoading = isDepositConfirming || isDepositPending
  const error = approveError || depositError

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white">
          <h2 className="font-headline-md text-primary">Secure Deposit</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors" disabled={isApproveLoading || isDepositLoading}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {isDepositSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-headline-md text-primary">Deposit Secured</h3>
              <p className="font-body-md text-on-surface-variant">Your funds have been securely locked in the escrow smart contract.</p>
            </div>
          ) : (
            <>
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-1 text-center border border-outline-variant/30">
                <span className="font-body-md text-on-surface-variant">Total to deposit</span>
                <span className="font-display-lg text-primary">{formatMusdcToNaira(totalAmount)}</span>
              </div>

              {error && (
                <div className="bg-error-container text-error p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="font-body-md text-sm">{error.message.split('\n')[0] || 'Transaction failed. Please try again.'}</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* Step 1: Approve */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-colors ${step === 1 ? 'border-primary bg-white shadow-sm' : 'border-outline-variant/30 bg-surface-container-low/50 opacity-60'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step === 1 ? 'bg-primary text-white' : step === 2 ? 'bg-primary text-white' : 'bg-outline-variant text-white'}`}>
                    {step === 2 ? <CheckCircle2 size={14} /> : <span className="font-label-caps text-xs">1</span>}
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div>
                      <h4 className="font-label-caps text-sm font-bold text-on-surface">Authorize Deposit</h4>
                      <p className="font-body-md text-sm text-on-surface-variant">Allow OgaRent to hold your funds securely.</p>
                    </div>
                    {step === 1 && (
                      <button 
                        onClick={handleApprove}
                        disabled={isApproveLoading}
                        className="w-full py-3 rounded-lg bg-primary text-on-primary font-label-caps font-bold text-sm hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isApproveLoading && <Loader2 size={16} className="animate-spin" />}
                        {isApproveConfirming ? 'Confirm in Wallet...' : isApprovePending ? 'Approving...' : 'Authorize'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step 2: Deposit */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-colors ${step === 2 ? 'border-primary bg-white shadow-sm' : 'border-outline-variant/30 bg-surface-container-low/50 opacity-60'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step === 2 ? 'bg-primary text-white' : 'bg-outline-variant text-white'}`}>
                    <span className="font-label-caps text-xs">2</span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div>
                      <h4 className="font-label-caps text-sm font-bold text-on-surface">Lock Deposit</h4>
                      <p className="font-body-md text-sm text-on-surface-variant">Transfer funds into the secure escrow vault.</p>
                    </div>
                    {step === 2 && (
                      <button 
                        onClick={handleDeposit}
                        disabled={isDepositLoading}
                        className="w-full py-3 rounded-lg bg-primary text-on-primary font-label-caps font-bold text-sm hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isDepositLoading && <Loader2 size={16} className="animate-spin" />}
                        {isDepositConfirming ? 'Confirm in Wallet...' : isDepositPending ? 'Depositing...' : 'Lock Deposit'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
