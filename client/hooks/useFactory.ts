import { useReadContracts } from 'wagmi'
import { OgaRentFactoryABI } from '@/lib/evm/abis'
import { getFactoryAddress } from '@/lib/evm/addresses'
import { Address } from 'viem'
import { useMemo } from 'react'

export function useUserEscrows(userAddress: Address | undefined) {
  const factoryAddress = getFactoryAddress()
  
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: factoryAddress,
        abi: OgaRentFactoryABI,
        functionName: 'getEscrowsByTenant',
        args: userAddress ? [userAddress] : undefined,
      },
      {
        address: factoryAddress,
        abi: OgaRentFactoryABI,
        functionName: 'getEscrowsByLandlord',
        args: userAddress ? [userAddress] : undefined,
      }
    ],
    query: {
      enabled: !!userAddress,
    }
  })

  const escrows = useMemo(() => {
    if (!data) return []
    const tenantEscrows = (data[0].result as Address[]) || []
    const landlordEscrows = (data[1].result as Address[]) || []
    
    // Deduplicate addresses and reverse so newest is first
    return Array.from(new Set([...tenantEscrows, ...landlordEscrows])).reverse()
  }, [data])

  return {
    data: escrows,
    isLoading,
    isError,
    refetch
  }
}
