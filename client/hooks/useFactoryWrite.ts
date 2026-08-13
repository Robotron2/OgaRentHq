import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { OgaRentFactoryABI } from '@/lib/evm/abis'
import { getFactoryAddress, getTokenAddress, getPlatformAdminAddress } from '@/lib/evm/addresses'
import { Address, decodeEventLog } from 'viem'
import { useMemo } from 'react'

export function useCreateEscrow() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { data: receipt, isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const newEscrowAddress = useMemo(() => {
    if (!receipt || !isSuccess) return undefined
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: OgaRentFactoryABI,
          data: log.data,
          topics: log.topics,
        })
        if (decoded.eventName === 'EscrowCreated') {
          return (decoded.args as any).escrow as Address
        }
      } catch (e) {
        // Ignore logs that don't match the ABI
      }
    }
    return undefined
  }, [receipt, isSuccess])

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
    hash,
    newEscrowAddress
  }
}
