import { useReadContract } from 'wagmi'
import { OgaRentFactoryABI } from '@/lib/evm/abis'
import { getFactoryAddress } from '@/lib/evm/addresses'
import { Address } from 'viem'

export function useTenantEscrows(tenantAddress: Address | undefined) {
  return useReadContract({
    address: getFactoryAddress(),
    abi: OgaRentFactoryABI,
    functionName: 'getEscrowsByTenant',
    args: tenantAddress ? [tenantAddress] : undefined,
    query: {
      enabled: !!tenantAddress,
    }
  })
}
