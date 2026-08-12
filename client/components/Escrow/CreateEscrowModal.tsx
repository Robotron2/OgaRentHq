'use client'

import { useState } from 'react'
import { Address, isAddress, parseUnits } from 'viem'
import { useCreateEscrow } from '@/hooks/useFactoryWrite'
import { useWallet } from '@/hooks/useWallet'
import { X, Loader2 } from 'lucide-react'

interface CreateEscrowModalProps {
  onClose: () => void
}

export default function CreateEscrowModal({ onClose }: CreateEscrowModalProps) {
  const { address: userAddress } = useWallet()
  const { createEscrow, isPending, isSuccess, error } = useCreateEscrow()

  const [formData, setFormData] = useState({
    landlord: '',
    agent: '',
    rentAmount: '',
    agentFee: '',
    cautionDeposit: ''
  })

  const [validationError, setValidationError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!userAddress) {
      setValidationError('Please connect your wallet first.')
      return
    }

    if (!isAddress(formData.landlord)) {
      setValidationError('Invalid Landlord Address')
      return
    }

    if (!isAddress(formData.agent)) {
      setValidationError('Invalid Agent Address')
      return
    }

    if (!formData.rentAmount || !formData.agentFee || !formData.cautionDeposit) {
      setValidationError('Please fill in all amounts')
      return
    }

    try {
      createEscrow(
        userAddress as Address, // User creating is the Tenant
        formData.landlord as Address,
        formData.agent as Address,
        parseUnits(formData.rentAmount, 6),
        parseUnits(formData.agentFee, 6),
        parseUnits(formData.cautionDeposit, 6)
      )
    } catch (err) {
      console.error(err)
      setValidationError('Failed to parse input values.')
    }
  }

  if (isSuccess) {
    setTimeout(onClose, 2000)
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
          <div>
            <label className="block font-label-lg font-medium text-on-surface mb-1">Landlord Address</label>
            <input 
              type="text"
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
              value={formData.landlord}
              onChange={e => setFormData({...formData, landlord: e.target.value})}
            />
          </div>

          <div>
            <label className="block font-label-lg font-medium text-on-surface mb-1">Agent Address</label>
            <input 
              type="text"
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
              value={formData.agent}
              onChange={e => setFormData({...formData, agent: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-lg font-medium text-on-surface mb-1">Rent Amount</label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={formData.rentAmount}
                  onChange={e => setFormData({...formData, rentAmount: e.target.value})}
                />
                <span className="absolute right-4 top-3.5 text-on-surface-variant text-sm font-medium">mUSDC</span>
              </div>
            </div>

            <div>
              <label className="block font-label-lg font-medium text-on-surface mb-1">Agent Fee</label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={formData.agentFee}
                  onChange={e => setFormData({...formData, agentFee: e.target.value})}
                />
                <span className="absolute right-4 top-3.5 text-on-surface-variant text-sm font-medium">mUSDC</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-label-lg font-medium text-on-surface mb-1">Caution Deposit</label>
            <div className="relative">
              <input 
                type="number"
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={formData.cautionDeposit}
                onChange={e => setFormData({...formData, cautionDeposit: e.target.value})}
              />
              <span className="absolute right-4 top-3.5 text-on-surface-variant text-sm font-medium">mUSDC</span>
            </div>
          </div>

          {(validationError || error) && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 mt-2 text-left">
              {validationError || (error?.message?.includes('User rejected') ? 'Transaction rejected' : 'Transaction failed')}
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
