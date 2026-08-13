import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'
import { bohr } from './chains'
import { http } from 'wagmi'

export const wagmiConfig = getDefaultConfig({
  appName: 'OgaRent',
  projectId: 'a3d463a0bb28d68bc8da4f4b16298516',
  chains: [bohr, mainnet],
  ssr: true,
  transports: {
    [bohr.id]: http(),
    [mainnet.id]: http(),
  },
})
