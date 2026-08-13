import { useReadContracts } from 'wagmi'
import { OgaRentEscrowABI } from '@/lib/evm/abis'
import { Address } from 'viem'
import { useWallet } from '@/hooks/useWallet'
import { determineRole, EscrowRole } from '@/lib/evm/roles'
import { properties } from '@/data/properties'

export type EscrowConfig = { tenant: Address; landlord: Address; agent: Address; platformAdmin: Address; token: Address; rentAmount: bigint; agentFee: bigint; cautionDeposit: bigint }

export type EnrichedEscrow = {
  address: Address
  config?: EscrowConfig
  role: EscrowRole
  state?: number
  occupancyTimestamp?: bigint
  property?: typeof properties[0]
}

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
      refetchInterval: 5000,
    }
  })

  const config = data?.[0].result as EscrowConfig | undefined
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

export function useMultipleEscrowDetails(escrowAddresses: readonly Address[]) {
  const { address: walletAddress } = useWallet()
  
  const contracts = escrowAddresses.flatMap(address => [
    { address, abi: OgaRentEscrowABI, functionName: 'getConfig' },
    { address, abi: OgaRentEscrowABI, functionName: 'getState' },
    { address, abi: OgaRentEscrowABI, functionName: 'occupancyTimestamp' }
  ])

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: escrowAddresses.length > 0,
      refetchInterval: 5000,
    }
  })

  const enrichedEscrows: EnrichedEscrow[] = escrowAddresses.map((address, index) => {
    const config = data?.[index * 3].result as EscrowConfig | undefined
    const state = data?.[index * 3 + 1].result as number | undefined
    const occupancyTimestamp = data?.[index * 3 + 2].result as bigint | undefined
    const role = determineRole(walletAddress, config)
    
    const property = config 
      ? properties.find(p => p.landlordAddress.toLowerCase() === config.landlord.toLowerCase() && p.rentAmount === config.rentAmount) 
      : undefined

    return {
      address,
      config,
      role,
      state,
      occupancyTimestamp,
      property
    }
  })

  return {
    escrows: enrichedEscrows,
    isLoading,
    isError,
    refetch
  }
}

