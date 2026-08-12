'use client'

import { useEffect } from 'react'
import { Address } from 'viem'
import { useEscrowWrite } from '@/hooks/useEscrowWrite'
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

interface RaiseDisputeModalProps {
  isOpen: boolean
  onClose: () => void
  escrowAddress: Address
}

export default function RaiseDisputeModal({ isOpen, onClose, escrowAddress }: RaiseDisputeModalProps) {
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
      const timer = setTimeout(() => onClose(), 3000)
      return () => clearTimeout(timer)
    }
  }, [isTxSuccess, onClose])

  if (!isOpen) return null

  const handleDispute = () => {
    executeAction(escrowAddress, 'raiseDispute')
  }

  const isLoading = isConfirming || isTxPending

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white">
          <h2 className="font-headline-md text-error">Report an Issue</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {isTxSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-headline-md text-error">Issue Reported</h3>
              <p className="font-body-md text-on-surface-variant">The escrow has been frozen. Our platform administrators will review the case shortly.</p>
            </div>
          ) : (
            <>
              <div className="bg-error-container/50 rounded-xl p-6 flex flex-col items-center text-center gap-4 border border-error/30">
                <div className="w-12 h-12 bg-error text-white rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-label-caps text-base font-bold text-error">Freeze Escrow Funds?</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Reporting an issue will immediately freeze all funds in the escrow. A platform admin will investigate and resolve the dispute.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-error-container text-error p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <p className="font-body-md text-sm">{error.message.split('\n')[0] || 'Transaction failed. Please try again.'}</p>
                </div>
              )}

              <button 
                onClick={handleDispute}
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-error text-white font-label-caps font-bold hover:bg-error/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {isConfirming ? 'Confirm in Wallet...' : isTxPending ? 'Processing...' : "Yes, Freeze Escrow"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
