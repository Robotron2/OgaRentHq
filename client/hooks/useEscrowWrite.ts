import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { OgaRentEscrowABI } from '@/lib/evm/abis'
import { Address } from 'viem'

export type EscrowAction = 'deposit' | 'confirmOccupancy' | 'raiseDispute'

export function useEscrowWrite() {
  const { writeContract, data: hash, isPending: isConfirming, isError, error, reset } = useWriteContract()

  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const executeAction = (escrowAddress: Address, functionName: EscrowAction) => {
    writeContract({
      address: escrowAddress,
      abi: OgaRentEscrowABI,
      functionName,
    })
  }

  const resolveDispute = (escrowAddress: Address, payLandlord: boolean) => {
    writeContract({
      address: escrowAddress,
      abi: OgaRentEscrowABI,
      functionName: 'resolveDispute',
      args: [payLandlord],
    })
  }

  return {
    executeAction,
    resolveDispute,
    isConfirming,
    isTxPending,
    isTxSuccess,
    error,
    hash,
    reset
  }
}
