'use client'

import { useEffect } from 'react'
import { Address } from 'viem'
import { useEscrowWrite } from '@/hooks/useEscrowWrite'
import { X, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'

interface ConfirmOccupancyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  escrowAddress: Address
}

export default function ConfirmOccupancyModal({ isOpen, onClose, onSuccess, escrowAddress }: ConfirmOccupancyModalProps) {
  const {
    executeAction,
    isConfirming,
    isTxPending,
    isTxSuccess,
    error,
    reset
  } = useEscrowWrite()

  useEffect(() => {
    if (isOpen) reset()
  }, [isOpen])

  useEffect(() => {
    if (isTxSuccess) {
      if (onSuccess) onSuccess()
      const timer = setTimeout(() => onClose(), 3000)
      return () => clearTimeout(timer)
    }
  }, [isTxSuccess, onClose, onSuccess])

  if (!isOpen) return null

  const handleConfirm = () => {
    executeAction(escrowAddress, 'confirmOccupancy')
  }

  const isLoading = isConfirming || isTxPending

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white">
          <h2 className="font-headline-md text-primary">Complete Agreement</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {isTxSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-headline-md text-primary">Agreement Completed!</h3>
              <p className="font-body-md text-on-surface-variant">The landlord has been paid and your lease is now active. Your caution deposit is locked securely.</p>
            </div>
          ) : (
            <>
              <div className="bg-surface-container-low rounded-xl p-6 flex flex-col items-center text-center gap-4 border border-outline-variant/30">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <KeyRound size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-label-caps text-base font-bold text-on-surface">Complete Escrow Agreement?</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    By confirming, you authorize OgaRent to release the rent to the landlord and the fee to the agent.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-error-container text-error p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="font-body-md text-sm">{error.message.split('\n')[0] || 'Transaction failed. Please try again.'}</p>
                </div>
              )}

              <button 
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-caps font-bold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {isConfirming ? 'Confirm in Wallet...' : isTxPending ? 'Processing...' : "Complete Escrow Agreement"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
