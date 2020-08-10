// source:
// https://raw.githubusercontent.com/aragon/unipool-frontend/75bc80f6d90d9baccc3fe1a6f423fc2d6d4215d2/lib/web3-utils.js
import { useEffect, useState } from 'react'
import { utils as EthersUtils, ethers, BigNumber } from 'ethers'
import { bigNum } from './utils'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

export const isAddress = (address: string): boolean => {
  return ADDRESS_REGEX.test(address)
}

export const shortenAddress = (address: string, charsLength = 4): string => {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export const getNetworkName = (chainId: number): string => {
  const chainIdComp = String(chainId)

  if (chainIdComp === '1') return 'Mainnet'
  if (chainIdComp === '4') return 'Rinkeby'

  return 'Unknown'
}

export const identifyProvider = (
  provider: ethers.providers.Provider | ethers.providers.BaseProvider
): string => {
  if (provider && (provider as any).isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

// Converts a token value from its integer form
// into its decimal form, both as strings.
export const fromTokenInteger = (value: number, decimals: number): string => {
  if (decimals === undefined) {
    throw new Error('Please specify the number of decimals')
  }

  const newValue = String(value).padStart(decimals, '0')
  const decPart = newValue.slice(-decimals).replace(/0+$/, '')

  return (newValue.slice(0, -decimals) || '0') + (decPart ? `.${decPart}` : '')
}

/**
 * Convert a token into a USD price
 *
 * @param {String} symbol The symbol of the token to convert from.
 * @param {Number} decimals The amount of decimals for the token.
 * @param {BigNumber} balance The balance to convert into USD.
 */
export const useTokenBalanceToUsd = (
  symbol: string,
  decimals: number,
  balance: BigNumber
): string => {
  const [usd, setUsd] = useState('-')
  useEffect(() => {
    let cancelled = false

    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`
    )
      .then(res => res.json())
      .then(price => {
        if (cancelled || !balance || !(parseFloat(price.USD) > 0)) {
          return
        }

        const usdDigits = 2
        const precision = 6

        const usdBalance = balance
          .mul(
            bigNum(parseInt(`${price.USD * 10 ** (precision + usdDigits)}`, 10))
          )
          .div(10 ** precision)
          .div(bigNum(10).pow(decimals))

        setUsd(formatUnits(usdBalance, { digits: usdDigits }))
      })
    return () => {
      cancelled = true
    }
  }, [balance, decimals, symbol])

  return usd
}

export const useTokenUsdRate = (symbol: string): string => {
  const [usd, setUsd] = useState<string>('')
  useEffect(() => {
    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`
    )
      .then(res => res.json())
      .then(price => {
        if (!(parseFloat(price.USD) > 0)) {
          return
        }
        setUsd(price)
      })
  }, [symbol])

  return usd
}

/**
 * Parse a unit set for an input and return it as a BigNumber.
 *
 * @param {String} value Value to parse into an amount of units.
 * @param {Number} options.digits Amount of digits on the token.
 * @return {BigNumber}
 */
export const parseUnits = (value: string, { digits = 18 } = {}): BigNumber => {
  value = value.replace(/,/g, '').trim()
  try {
    return EthersUtils.parseUnits(value || '0', digits)
  } catch (err) {
    return bigNum(-1)
  }
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {BigNumber|string} value Amount of units to format.
 * @param {Number} options.digits Amount of digits on the token.
 * @param {Boolean} options.commas Use comma-separated groups.
 * @param {Boolean} options.replaceZeroBy The string to be returned when value is zero.
 * @param {Number} options.truncateToDecimalPlace Number of decimal places to show.
 */
export const formatUnits = (
  value: BigNumber | string,
  {
    digits = 18,
    commas = true,
    replaceZeroBy = '',
    truncateToDecimalPlace = 0
  } = {}
): string => {
  if (typeof value === 'string') {
    value = bigNum(value)
  }

  if (typeof value !== 'string' && (value.lt(0) || digits < 0)) {
    return ''
  }

  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return replaceZeroBy
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  if (typeof truncateToDecimalPlace === 'number') {
    const [whole = '', dec = ''] = valueBeforeCommas.split('.')
    if (dec) {
      const truncatedDec = dec
        .slice(0, truncateToDecimalPlace)
        .replace(/0*$/, '')
      valueBeforeCommas = truncatedDec ? `${whole}.${truncatedDec}` : whole
    }
  }

  return commas ? EthersUtils.commify(valueBeforeCommas) : valueBeforeCommas
}
