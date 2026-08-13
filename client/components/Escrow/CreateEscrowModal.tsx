'use client'

import { useState, useEffect } from 'react'
import { Address } from 'viem'
import { useCreateEscrow } from '@/hooks/useFactoryWrite'
import { useWallet } from '@/hooks/useWallet'
import { X, Loader2, ShieldCheck, MapPin } from 'lucide-react'
import { Property } from '@/data/properties'
import { formatUnits } from 'viem'
import { useRouter } from 'next/navigation'

interface CreateEscrowModalProps {
  property: Property
  onClose: () => void
}

export default function CreateEscrowModal({ property, onClose }: CreateEscrowModalProps) {
  const { address: userAddress, isWrongNetwork, switchNetwork } = useWallet()
  const { createEscrow, isPending, isSuccess, error } = useCreateEscrow()
  const router = useRouter()

  const [validationError, setValidationError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!userAddress) {
      setValidationError('Please connect your wallet first.')
      return
    }

    if (isWrongNetwork) {
      if (switchNetwork) switchNetwork()
      setValidationError('Please switch to the BOT Chain testnet.')
      return
    }

    try {
      createEscrow(
        userAddress as Address,
        property.landlordAddress,
        property.agentAddress,
        property.rentAmount,
        property.agentFee,
        property.cautionDeposit
      )
    } catch (err) {
      console.error(err)
      setValidationError('Failed to parse input values.')
    }
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose()
        router.push('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onClose, router])

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="font-headline-md text-primary mb-2 font-bold">Agreement Created!</h2>
          <p className="font-body-md text-on-surface-variant">The rental agreement has been registered on-chain.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/20 bg-surface-container-low">
          <h2 className="font-headline-sm font-bold text-primary">New Rental Agreement</h2>
          <button onClick={onClose} className="p-2 hover:bg-outline-variant/10 rounded-full text-on-surface-variant transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-outline-variant/20 pb-4">
            <h3 className="font-headline-sm text-primary">{property.title}</h3>
            <p className="text-sm text-on-surface-variant flex items-center gap-1"><MapPin size={14}/> {property.location}</p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Annual Rent</span>
              <span className="font-medium text-on-surface">{formatUnits(property.rentAmount, 6)} mUSDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Caution Deposit</span>
              <span className="font-medium text-on-surface">{formatUnits(property.cautionDeposit, 6)} mUSDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Agent Fee</span>
              <span className="font-medium text-on-surface">{formatUnits(property.agentFee, 6)} mUSDC</span>
            </div>
            <div className="pt-3 mt-1 border-t border-outline-variant/20 flex justify-between font-bold">
              <span className="text-primary">Total to Secure</span>
              <span className="text-primary">{formatUnits(property.rentAmount + property.cautionDeposit + property.agentFee, 6)} mUSDC</span>
            </div>
          </div>
          
          <div className="bg-tertiary-fixed/30 text-on-tertiary-fixed p-3 rounded-lg flex items-start gap-2 text-sm border border-tertiary-fixed-dim/30">
            <ShieldCheck size={18} className="shrink-0 mt-0.5" />
            <p>Creating this agreement will register the terms on the blockchain. You will not be charged yet. You can deposit funds from your dashboard after creation.</p>
          </div>

          {(validationError || error) && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 mt-2 text-left max-h-32 overflow-y-auto">
              {validationError || 
                (error?.message?.includes('User rejected') 
                  ? 'Transaction rejected by user' 
                  : (error as any)?.shortMessage || error?.message || 'Transaction failed')
              }
            </div>
          )}

          <div className="mt-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isPending && <Loader2 className="animate-spin" size={18} />}
              {isPending ? 'Creating On-Chain...' : 'Create Escrow Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
