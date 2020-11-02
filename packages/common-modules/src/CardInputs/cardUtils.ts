type CardType =
  | "Mastercard"
  | "Visa"
  | "AMEX"
  | "Discover"
  | "Diners"
  | "Diners - Carte Blanche"
  | "JCB"
  | "Visa Electron"

export function detectCardType(number: string): CardType | undefined {
  // visa
  var re = new RegExp("^4")
  if (number.match(re) != null) return "Visa"

  // Mastercard
  re = new RegExp("^5[1-5]")
  if (number.match(re) != null) return "Mastercard"

  // AMEX
  re = new RegExp("^3[47]")
  if (number.match(re) != null) return "AMEX"

  // Discover
  re = new RegExp(
    "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)",
  )
  if (number.match(re) != null) return "Discover"

  // Diners
  re = new RegExp("^36")
  if (number.match(re) != null) return "Diners"

  // Diners - Carte Blanche
  re = new RegExp("^30[0-5]")
  if (number.match(re) != null) return "Diners - Carte Blanche"

  // JCB
  re = new RegExp("^35(2[89]|[3-8][0-9])")
  if (number.match(re) != null) return "JCB"

  // Visa Electron
  re = new RegExp("^(4026|417500|4508|4844|491(3|7))")
  if (number.match(re) != null) return "Visa Electron"

  return undefined
}

export function formatCardNumber(value: string): string {
  if (!value) {
    return ""
  }

  // clear number
  const clearValue = value.replace(/\D+/g, "")
  const nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
    4,
    8,
  )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
  return nextValue.trim()
}
