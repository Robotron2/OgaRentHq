import { defineChain } from 'viem'
import { BOT_CHAIN_ID } from './addresses'

export const bohr = defineChain({
  id: BOT_CHAIN_ID,
  name: 'BOT Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BOT',
    symbol: 'BOT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
    public: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: { name: 'BOT Scan', url: 'https://scan.bohr.life' },
  },
})
