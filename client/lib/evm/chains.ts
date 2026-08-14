import { defineChain } from 'viem'
import { BOT_CHAIN_ID } from './addresses'

export const botchain = defineChain({
  id: BOT_CHAIN_ID,
  name: 'BOT Chain Mainnet',
  network: 'bot-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BOT',
    symbol: 'BOT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.botchain.ai'],
    },
    public: {
      http: ['https://rpc.botchain.ai'],
    },
  },
  blockExplorers: {
    default: { name: 'BOT Scan', url: 'https://scan.botchain.ai' },
  },
  testnet: false,
})
