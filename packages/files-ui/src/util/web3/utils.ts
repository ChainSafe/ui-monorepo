// source:
// https://raw.githubusercontent.com/aragon/unipool-frontend/75bc80f6d90d9baccc3fe1a6f423fc2d6d4215d2/lib/utils.js

import { useState, useEffect } from 'react'
import { BigNumber, BigNumberish, ethers, providers } from 'ethers'
import { environment } from '../environment'

export function getEtherscanHref(transactionHash: string) {
  const chainId = environment('CHAIN_ID')

  return `https://${
    chainId === '4' ? 'rinkeby.' : ''
  }etherscan.io/tx/${transactionHash}`
}

export function bigNum(value: BigNumberish) {
  return BigNumber.from(value)
}

export const useNow = (updateEvery = 1000) => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, updateEvery)
    return () => {
      clearInterval(timer)
    }
  }, [updateEvery])
  return now
}

export const signMessage = async (
  message: string,
  provider: providers.Web3Provider
) => {
  const data = ethers.utils.toUtf8Bytes(message)
  const signer = await provider.getSigner()
  const addr = await signer.getAddress()
  const sig = await provider.send('personal_sign', [
    ethers.utils.hexlify(data),
    addr.toLowerCase()
  ])
  return sig
}
