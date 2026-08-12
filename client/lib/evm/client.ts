import { createConfig, http } from 'wagmi'
import { bohr } from './chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [bohr],
  connectors: [
    injected()
  ],
  transports: {
    [bohr.id]: http(),
  },
})
