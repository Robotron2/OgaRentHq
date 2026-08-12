import { useAccount, useSwitchChain, useChainId } from 'wagmi'
import { BOT_CHAIN_ID } from '../lib/evm/addresses'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chainId !== BOT_CHAIN_ID

  const handleSwitchNetwork = () => {
    try {
      if (switchChain) {
        switchChain({ chainId: BOT_CHAIN_ID })
      }
    } catch (err) {
      console.error('Switch network error:', err)
    }
  }

  return {
    address,
    isConnected,
    isWrongNetwork,
    switchNetwork: handleSwitchNetwork,
  }
}
