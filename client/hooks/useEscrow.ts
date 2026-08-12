import { useReadContracts } from 'wagmi'
import { OgaRentEscrowABI } from '@/lib/evm/abis'
import { Address } from 'viem'
import { useWallet } from '@/hooks/useWallet'
import { determineRole } from '@/lib/evm/roles'

export function useEscrowDetails(escrowAddress: Address | undefined) {
  const { address: walletAddress } = useWallet()
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: escrowAddress,
        abi: OgaRentEscrowABI,
        functionName: 'getConfig',
      },
      {
        address: escrowAddress,
        abi: OgaRentEscrowABI,
        functionName: 'getState',
      },
      {
        address: escrowAddress,
        abi: OgaRentEscrowABI,
        functionName: 'occupancyTimestamp',
      }
    ],
    query: {
      enabled: !!escrowAddress,
    }
  })

  const config = data?.[0].result as { tenant: Address; landlord: Address; agent: Address; platformAdmin: Address; token: Address; rentAmount: bigint; agentFee: bigint; cautionDeposit: bigint } | undefined
  const role = determineRole(walletAddress, config)

  return {
    config,
    role,
    state: data?.[1].result as number | undefined,
    occupancyTimestamp: data?.[2].result as bigint | undefined,
    isLoading,
    isError,
    refetch,
  }
}
