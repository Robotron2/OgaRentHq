import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { BOT_CHAIN_ID } from '../lib/evm/addresses'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chainId !== BOT_CHAIN_ID

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: BOT_CHAIN_ID })
    }
  }

  return {
    address,
    isConnected,
    isWrongNetwork,
    connect: handleConnect,
    disconnect,
    switchNetwork: handleSwitchNetwork,
  }
}
