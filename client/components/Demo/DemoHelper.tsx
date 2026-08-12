'use client'

import { useWallet } from '@/hooks/useWallet'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { OgaRentFactoryABI, MockUSDCABI } from '@/lib/evm/abis'
import { getFactoryAddress, getTokenAddress } from '@/lib/evm/addresses'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function DemoHelper() {
  const { address, isConnected } = useWallet()
  const { writeContract: mintUSDC, data: mintHash, isPending: isMinting } = useWriteContract()
  const { writeContract: createEscrow, data: escrowHash, isPending: isCreating } = useWriteContract()

  const { isSuccess: isMintSuccess } = useWaitForTransactionReceipt({ hash: mintHash })
  const { isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({ hash: escrowHash })

  const handleMint = () => {
    if (!address) return
    mintUSDC({
      address: getTokenAddress(),
      abi: MockUSDCABI,
      functionName: 'mint',
      args: [address, 10000000000n] // 10,000 mUSDC
    })
  }

  const handleCreateEscrow = () => {
    if (!address) return
    const landlord = '0x1111111111111111111111111111111111111111'
    const agent = '0x2222222222222222222222222222222222222222'
    const platformAdmin = '0x3333333333333333333333333333333333333333'
    const token = getTokenAddress()
    
    // Example values in mUSDC (6 decimals): 1000, 100, 200
    const rent = 1000000000n
    const fee = 100000000n
    const caution = 200000000n

    createEscrow({
      address: getFactoryAddress(),
      abi: OgaRentFactoryABI,
      functionName: 'createEscrow',
      args: [address, landlord, agent, platformAdmin, token, rent, fee, caution]
    })
  }

  if (!isConnected) {
    return <div className="p-8 text-center bg-white rounded-2xl border border-outline-variant/30 mt-8 max-w-2xl mx-auto">Connect your wallet to use the Demo Helper.</div>
  }

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-8 flex flex-col gap-8 max-w-2xl mx-auto mt-8">
      <div>
        <h2 className="font-headline-md text-primary mb-2">Testnet Demo Tools</h2>
        <p className="font-body-md text-on-surface-variant">Use these tools to initialize a test environment for your wallet.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div>
            <h3 className="font-label-caps font-bold">1. Mint Test Tokens</h3>
            <p className="text-sm text-on-surface-variant">Get 10,000 mUSDC to fund your escrows.</p>
          </div>
          <button 
            onClick={handleMint}
            disabled={isMinting}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 flex items-center gap-2"
          >
            {isMinting ? <Loader2 size={16} className="animate-spin" /> : isMintSuccess ? <CheckCircle2 size={16} /> : null}
            {isMinting ? 'Minting...' : isMintSuccess ? 'Minted' : 'Mint mUSDC'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div>
            <h3 className="font-label-caps font-bold">2. Create Demo Escrow</h3>
            <p className="text-sm text-on-surface-variant">Deploy a test escrow where you are the tenant.</p>
          </div>
          <button 
            onClick={handleCreateEscrow}
            disabled={isCreating}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 flex items-center gap-2"
          >
            {isCreating ? <Loader2 size={16} className="animate-spin" /> : isCreateSuccess ? <CheckCircle2 size={16} /> : null}
            {isCreating ? 'Creating...' : isCreateSuccess ? 'Created' : 'Deploy Escrow'}
          </button>
        </div>
      </div>
    </div>
  )
}
