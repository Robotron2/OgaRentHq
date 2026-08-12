import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { OgaRentFactoryABI } from '@/lib/evm/abis'
import { getFactoryAddress, getTokenAddress, getPlatformAdminAddress } from '@/lib/evm/addresses'
import { Address } from 'viem'

export function useCreateEscrow() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createEscrow = (
    tenant: Address,
    landlord: Address,
    agent: Address,
    rentAmount: bigint,
    agentFee: bigint,
    cautionDeposit: bigint
  ) => {
    writeContract({
      address: getFactoryAddress(),
      abi: OgaRentFactoryABI,
      functionName: 'createEscrow',
      args: [
        tenant,
        landlord,
        agent,
        getPlatformAdminAddress(),
        getTokenAddress(),
        rentAmount,
        agentFee,
        cautionDeposit
      ]
    })
  }

  return {
    createEscrow,
    isPending: isPending || isWaiting,
    isSuccess,
    error,
    hash
  }
}
