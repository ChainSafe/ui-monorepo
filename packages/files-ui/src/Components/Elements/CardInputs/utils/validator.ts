import * as cardTypes from "./cardTypes"

const MONTH_REGEX = /(0[1-9]|1[0-2])/

export enum CardNumberErrors {
  EMPTY_CARD_NUMBER = "Enter a card number",
  INVALID_CARD_NUMBER = "Card number is invalid",
}

export enum CardExpiryErrors {
  EMPTY_EXPIRY_DATE = "Enter an expiry date",
  MONTH_OUT_OF_RANGE = "Expiry month must be between 01 and 12",
  INVALID_EXPIRY_DATE = "Expiry date is invalid",
  YEAR_OUT_OF_RANGE = "Expiry year cannot be in the past",
  DATE_OUT_OF_RANGE = "Expiry date cannot be in the past",
}

export enum CardCvcErrors {
  EMPTY_CVC = "Enter a CVC",
  INVALID_CVC = "CVC is invalid",
}

export const hasCardNumberReachedMaxLength = (currentValue: string) => {
  const cardType = cardTypes.getCardTypeByValue(currentValue)
  return (
    cardType &&
    currentValue.length >= cardType.lengths[cardType.lengths.length - 1]
  )
}

export const isNumeric = (e: any) => {
  return /^\d*$/.test(e.key)
}

export const validateLuhn = (cardNumber: string) => {
  return (
    cardNumber
      .split("")
      .reverse()
      .map((digit) => parseInt(digit, 10))
      .map((digit, idx) => (idx % 2 ? digit * 2 : digit))
      .map((digit) => (digit > 9 ? (digit % 10) + 1 : digit))
      .reduce((accum, digit) => (accum += digit)) %
      10 ===
    0
  )
}

export const getCardNumberError = (cardNumber: string): string | undefined => {
  if (!cardNumber) {
    return CardNumberErrors.EMPTY_CARD_NUMBER
  }

  const rawCardNumber = cardNumber.replace(/\s/g, "")
  const cardType = cardTypes.getCardTypeByValue(rawCardNumber)
  if (cardType && cardType.lengths) {
    const doesCardNumberMatchLength = cardType.lengths.includes(
      rawCardNumber.length
    )
    if (doesCardNumberMatchLength) {
      const isLuhnValid = validateLuhn(rawCardNumber)
      if (isLuhnValid) {
        return
      }
    }
  }
  return CardNumberErrors.INVALID_CARD_NUMBER
}

export const getExpiryDateError = (expiryDate: string): string | undefined => {
  if (!expiryDate) {
    return CardExpiryErrors.EMPTY_EXPIRY_DATE
  }
  const rawExpiryDate = expiryDate.replace(" / ", "").replace("/", "")
  if (rawExpiryDate.length === 4) {
    const month = rawExpiryDate.slice(0, 2)
    const year = `20${rawExpiryDate.slice(2, 4)}`
    if (!MONTH_REGEX.test(month)) {
      return CardExpiryErrors.MONTH_OUT_OF_RANGE
    }
    if (parseInt(year) < new Date().getFullYear()) {
      return CardExpiryErrors.YEAR_OUT_OF_RANGE
    }
    if (
      parseInt(year) === new Date().getFullYear() &&
      parseInt(month) < new Date().getMonth() + 1
    ) {
      return CardExpiryErrors.DATE_OUT_OF_RANGE
    }
    return
  }
  return CardExpiryErrors.INVALID_EXPIRY_DATE
}

export const getCVCError = (cvc: string, cardNumber: string) => {
  const cardType = cardTypes.getCardTypeByValue(cardNumber)
  if (!cvc) {
    return CardCvcErrors.EMPTY_CVC
  }
  if (cvc.length < 3) {
    return CardCvcErrors.INVALID_CVC
  }
  if (cardType && cvc.length !== cardType.code.length) {
    return CardCvcErrors.INVALID_CVC
  }
  return
}
