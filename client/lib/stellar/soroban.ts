/**
 * OgaRent - Soroban Smart Contract Interoperability Module
 * 
 * This module handles the construction of XDR transactions intended for the 
 * OgaRent Soroban smart contracts. 
 * 
 * IMPORTANT: These functions ONLY construct the raw transaction intent. 
 * They DO NOT sign or submit the transaction to the network locally. 
 * Finalized transaction XDRs must be forwarded to the backend gas-relayer 
 * for fee sponsorship and submission.
 */

/**
 * Prepares the XDR payload required for a tenant to lock USDC into escrow.
 * 
 * TODO: [Wave Contributor]
 * Implement Soroban SDK contract invocation for `deposit_rent`.
 * See the corresponding GitHub issue.
 */
export async function invokeDepositRent(): Promise<string> {
  throw new Error("TODO: Drips Wave contributor to implement");
}

/**
 * Prepares the XDR payload required for a tenant to confirm their successful move-in,
 * triggering the release of funds.
 * 
 * TODO: [Wave Contributor]
 * Implement Soroban SDK contract invocation for `confirm_occupancy`.
 * See the corresponding GitHub issue.
 */
export async function invokeConfirmOccupancy(): Promise<string> {
  throw new Error("TODO: Drips Wave contributor to implement");
}
