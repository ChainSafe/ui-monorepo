function clearNumber(value = '') {
  return value.replace(/\D+/g, '')
}

export function formatCreditCardNumber(value: string) {
  if (!value) {
    return ''
  }

  const clearValue = clearNumber(value)
  const nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
    4,
    8
  )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
  return nextValue.trim()
}
