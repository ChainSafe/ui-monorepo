import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Connectors } from 'use-wallet'
import { useWalletAugmented } from 'src/HOCs/ConfiguredWalletProvider/ConfiguredWalletProvider'
import { useDispatch } from 'react-redux'
import { authenticateWeb3AuthAction } from 'src/store/reducers/auth/web3/actions'
import { providers } from 'ethers'
import { signMessage } from 'src/util/web3/utils'
import { getWeb3LoginTokenApi, IToken } from 'src/apiLib/userApi'
import { IconButton } from 'src/components/kit/buttons/IconButton/IconButton'
import { MetaMaskIcon } from 'src/components/kit/icons/metamask.icon'
import { WalletConnectIcon } from 'src/components/kit/icons/walletconnect.icon'

const Root = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin-bottom: 20px;
`

export const WalletAccessModule: React.FC = () => {
  const { activate, account, ethersProvider, deactivate } = useWalletAugmented()

  const dispatch = useDispatch()
  const [pendingSig, setPendingSig] = useState<boolean>(false)
  const activateWallet = async (connectorId: keyof Connectors) => {
    try {
      await activate(connectorId)
      setPendingSig(true)
    } catch (error) {
      // No error handling present in code base
    }
  }

  useEffect(() => {
    // Init
    localStorage.removeItem('walletconnect')
  }, [])

  useEffect(() => {
    const processWeb3Signin = async (
      address: string,
      provider: providers.Web3Provider
    ) => {
      try {
        // TODO: set loading state
        const token: IToken = await getWeb3LoginTokenApi()

        const signature = await signMessage(token.token, provider)
        // TODO can catch here for an error if needed
        setPendingSig(false)
        dispatch(
          await authenticateWeb3AuthAction({
            address,
            token: token.token,
            signature
          })
        )
      } catch (error) {
        // TODO clear loading state
        deactivate()
        localStorage.removeItem('walletconnect')
      }
    }
    if (pendingSig && account && ethersProvider) {
      processWeb3Signin(account, ethersProvider)
    }
    // eslint-disable-next-line
  }, [account, pendingSig, ethersProvider])

  return (
    <Root>
      <IconButton
        onClick={() => activateWallet('injected')}
        icon={<MetaMaskIcon />}
      >
        Connect with MetaMask
      </IconButton>
      <IconButton
        onClick={() => activateWallet('walletconnect')}
        icon={<WalletConnectIcon />}
      >
        Connect with WalletConnect
      </IconButton>
    </Root>
  )
}
