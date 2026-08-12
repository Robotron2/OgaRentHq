import { Address } from 'viem'

export const BOT_CHAIN_ID = 968

export const CONTRACT_ADDRESSES = {
  [BOT_CHAIN_ID]: {
    factory: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x8C90f76C40bD4213983ECbB38F92AeECd71e348b') as Address,
    mockUSDC: (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || '0x10B4265cD6cdA440025d7e142991c9ba8Ec918Ca') as Address,
    admin: (process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0x4f122240974955bE6De73873998D9f579E7A3125') as Address,
  }
}

export const getFactoryAddress = (chainId: number = BOT_CHAIN_ID): Address => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.factory
}

export const getTokenAddress = (chainId: number = BOT_CHAIN_ID): Address => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.mockUSDC
}

export const getPlatformAdminAddress = (chainId: number = BOT_CHAIN_ID): Address => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.admin
}
