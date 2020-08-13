import { formatCreditCardNumber } from '../cardHelpers'

describe('credit card number format', () => {
  it('should be trimmed', () => {
    const cNum = '  32  '
    expect(formatCreditCardNumber(cNum)).toBe('32')
  })

  it('should be empty for empty string', () => {
    const cNum = ''
    expect(formatCreditCardNumber(cNum)).toBe('')
  })

  it('should remove non numeric', () => {
    const cNum = 'ab%'
    expect(formatCreditCardNumber(cNum)).toBe('')
  })

  it('should be empty for null', () => {
    const cNum: any = null
    expect(formatCreditCardNumber(cNum)).toBe('')
  })

  it('should be empty for undefined', () => {
    const cNum: any = undefined
    expect(formatCreditCardNumber(cNum)).toBe('')
  })

  it('should not be spaced on 4 numbers', () => {
    const cNum = '  3223  '
    expect(formatCreditCardNumber(cNum)).toBe('3223')
  })

  it('should be spaced on 5 numbers', () => {
    const cNum = '  32234  '
    expect(formatCreditCardNumber(cNum)).toBe('3223 4')
  })

  it('should be spaced on 9 numbers', () => {
    const cNum = '  322341111  '
    expect(formatCreditCardNumber(cNum)).toBe('3223 4111 1')
  })

  it('should be max 19 numbers', () => {
    const cNum = '  12341234123412341234  '
    expect(formatCreditCardNumber(cNum)).toBe('1234 1234 1234 1234123')
  })
})
