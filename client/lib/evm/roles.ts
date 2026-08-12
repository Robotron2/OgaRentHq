import { Address } from 'viem'

export type EscrowRole = 'TENANT' | 'LANDLORD' | 'AGENT' | 'ADMIN' | 'NONE'

export function determineRole(
  walletAddress: Address | undefined,
  config: { tenant: Address; landlord: Address; agent: Address; platformAdmin: Address } | undefined
): EscrowRole {
  if (!walletAddress || !config) return 'NONE'
  
  const address = walletAddress.toLowerCase()
  if (address === config.tenant.toLowerCase()) return 'TENANT'
  if (address === config.landlord.toLowerCase()) return 'LANDLORD'
  if (address === config.agent.toLowerCase()) return 'AGENT'
  if (address === config.platformAdmin.toLowerCase()) return 'ADMIN'
  
  return 'NONE'
}
