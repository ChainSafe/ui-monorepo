import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'
import { useInterval } from 'src/util/hooks/useInterval'
import { billingInfoApi } from 'src/apiLib/driveApi'
import { CopyIcon } from 'src/components/kit/icons/copy.icon'
import copy from 'copy-to-clipboard'
import theme from 'src/assets/styles/theme.json'
import { customEllipsis, commaSplitting } from 'src/util/helpers'

type CopyButtonProps = {
  pingActive: boolean
}

const Root = styled.article``

const DataFieldWrapper = styled.label`
  display: flex;
  flex-direction: column;
  & .label {
    color: ${theme.colors.grey7};
    margin-bottom: 2px;
  }
  & .data-field {
    padding: 5px 12px;
    border: 1px solid ${theme.colors.grey7};
    color: ${theme.colors.grey7};
  }
`

const CopyButton = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  margin: 13px 0;
  border: 1px solid
    ${({ pingActive }: CopyButtonProps) =>
      pingActive ? theme.colors.green6 : theme.colors.grey7};
  padding: 5px 12px;
  transition-duration: 200ms;
  & > * {
    color: ${({ pingActive }: CopyButtonProps) =>
      pingActive ? theme.colors.green6 : theme.colors.grey7} !important;
  }
  & svg {
    height: 20px;
    width: 20px;
    fill: ${({ pingActive }: CopyButtonProps) =>
      pingActive ? theme.colors.green6 : theme.colors.primary};
    transition-duration: 200ms;
  }
`

interface IWallet {
  Addr: string
  Balance: number
  Message: string
  Name: string
  Type: string
}

export const FilecoinPaymentModule: React.FC = () => {
  const [wallet, setWallet] = useState<IWallet>({
    Addr: '',
    Balance: 0,
    Message: '',
    Name: '',
    Type: ''
  })
  // TODO: Profile update clears profile data on error
  const resolveData = async () => {
    try {
      const { wallets } = (await billingInfoApi()) as Partial<{
        wallets: IWallet
      }>
      if (wallets) {
        setWallet(wallets)
      }
    } catch (error) {
      //
    }
  }

  useInterval(() => {
    // Fetch state
    resolveData()
  }, 5000)

  // INIT
  useEffect(() => {
    resolveData()
  }, [])

  const [pingActive, setPingActive] = useState<boolean>(false)
  useEffect(() => {
    const timer1 = setTimeout(() => setPingActive(false), 500)
    return () => {
      clearTimeout(timer1)
    }
  }, [pingActive])

  const copyToClipboard = () => {
    copy(wallet.Addr)
    setPingActive(true)
  }

  return (
    <Root>
      <Typography.Title>Pay with FIL</Typography.Title>
      <Typography className="data-field">
        To make a payment in FIL, please send funds to this address:
      </Typography>
      <CopyButton pingActive={pingActive} onClick={() => copyToClipboard()}>
        <Typography>{customEllipsis(wallet.Addr, 30)}</Typography>
        <CopyIcon />
      </CopyButton>
      <DataFieldWrapper>
        <Typography className="label">Balance</Typography>
        <Typography className="data-field">
          {commaSplitting(wallet.Balance)} FIL
        </Typography>
      </DataFieldWrapper>
    </Root>
  )
}
