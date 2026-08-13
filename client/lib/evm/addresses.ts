import { Address } from 'viem'

export const BOT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 968)

export const CONTRACT_ADDRESSES = {
  [BOT_CHAIN_ID]: {
    factory: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x8c90f76c40bd4213983ecbb38f92aeecd71e348b') as Address,
    mockUSDC: (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || '0x10b4265cd6cda440025d7e142991c9ba8ec918ca') as Address,
    admin: (process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0x4f122240974955be6de73873998d9f579e7a3125') as Address,
  }
}

export const getFactoryAddress = (chainId: number = BOT_CHAIN_ID): Address => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.factory || CONTRACT_ADDRESSES[BOT_CHAIN_ID].factory
}

export const getTokenAddress = (chainId: number = BOT_CHAIN_ID): Address => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.mockUSDC || CONTRACT_ADDRESSES[BOT_CHAIN_ID].mockUSDC
}

export const getPlatformAdminAddress = (chainId: number = BOT_CHAIN_ID): Address => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.admin || CONTRACT_ADDRESSES[BOT_CHAIN_ID].admin
}
