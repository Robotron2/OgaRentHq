import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MockUSDCABI } from '@/lib/evm/abis'
import { getTokenAddress } from '@/lib/evm/addresses'
import { Address } from 'viem'

export function useTokenAllowance(owner: Address | undefined, spender: Address | undefined) {
  return useReadContract({
    address: getTokenAddress(),
    abi: MockUSDCABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!owner && !!spender,
    }
  })
}

export function useTokenApprove() {
  const { writeContract, data: hash, isPending: isConfirming, isError, error, reset } = useWriteContract()

  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approve = (spender: Address, amount: bigint) => {
    writeContract({
      address: getTokenAddress(),
      abi: MockUSDCABI,
      functionName: 'approve',
      args: [spender, amount],
    })
  }

  return {
    approve,
    isConfirming,
    isTxPending,
    isTxSuccess,
    error,
    hash,
    reset
  }
}
