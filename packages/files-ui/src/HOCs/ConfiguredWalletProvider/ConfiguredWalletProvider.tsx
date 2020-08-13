import React, { ReactNode, useContext, useMemo, useCallback } from 'react'
import { UseWalletProvider, useWallet, Connectors } from 'use-wallet'
import { RPC_URLS } from 'src/util/constants'
import { environment } from 'src/util/environment'
import { providers } from 'ethers'
import { getNetworkName } from 'src/util/web3/web3.utils'

interface IOwnProps {
  children: ReactNode
}

const CHAIN_ID = Number(environment('CHAIN_ID'))

export interface IAugmentedWallet<T> {
  activate: (connectorId: keyof Connectors) => Promise<boolean>
  account: string | null
  activated: keyof Connectors
  activating: boolean
  balance: string
  connected: boolean
  connectors: Connectors
  deactivate(): void
  chainId: number | null
  ethereum: T
  getBlockNumber(): number
  isContract: boolean
  networkName: string
  ethersProvider: providers.Web3Provider | null
}

const WalletAugmentedContext = React.createContext<IAugmentedWallet<
  any
> | null>(null)

// function logError(err: any, ...messages: any) {
//   // Custom logging can be set up here
//   console.error(...messages, err);
// }

// Add Ethers.js, error handling and analytics tracking to the useWallet() object
const WalletAugmented = ({ children }: any) => {
  const wallet = useWallet()
  const { ethereum, activate } = wallet
  const ethersProvider = useMemo(
    () =>
      ethereum
        ? new providers.Web3Provider(ethereum as providers.ExternalProvider)
        : null,
    [ethereum]
  )

  const augmentedActivate = useCallback(
    async (type: keyof Connectors) => {
      try {
        await activate(type)

        // TODO: Reactivate this tracking event with a proper count.ly tracker
        // trackEvent('web3_connect', {
        // segmentation: {
        // provider: type,
        // },
        // })

        return true
      } catch (error) {
        // if (error instanceof UnsupportedChainError) {
        //   logError(
        //     error,
        //     `Unsupported chain: please connect to the network called ${getNetworkName(
        //       CHAIN_ID
        //     )} in your Ethereum Provider.`
        //   );

        // }

        // logError(
        //   error,
        //   "An error happened while trying to activate the wallet, please try again."
        // );
        return false
      }
    },
    [activate]
  )
  const contextValue: IAugmentedWallet<any> = useMemo(
    () => ({
      ...wallet,
      activate: augmentedActivate,
      networkName: getNetworkName(CHAIN_ID),
      ethersProvider
    }),
    [wallet, ethersProvider, augmentedActivate]
  )

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

export const ConfiguredWalletProvider: React.FC<IOwnProps> = ({ children }) => {
  return (
    <UseWalletProvider
      chainId={CHAIN_ID}
      connectors={{
        // This is how connectors get configured
        walletconnect: {
          rpcUrl: RPC_URLS[CHAIN_ID]
        }
      }}
    >
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export const useWalletAugmented = () => {
  return useContext(WalletAugmentedContext) as IAugmentedWallet<any>
}
