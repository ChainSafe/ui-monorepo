import { creditCardValidator } from '../billingValidator'

describe('creditCardValidator', () => {
  const creditCarInputs = {
    cardName: '',
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCVC: ''
  }

  it('should be invalid', () => {
    const validData = creditCardValidator(creditCarInputs)
    expect(validData.errors.cardName.length).toBeGreaterThan(0)
    expect(validData.errors.cardNumber.length).toBeGreaterThan(0)
    expect(validData.errors.cardExpMonth.length).toBeGreaterThan(0)
    expect(validData.errors.cardExpYear.length).toBeGreaterThan(0)
    expect(validData.errors.cardCVC.length).toBeGreaterThan(0)
    expect(validData.isValid).toBeFalsy()
  })

  it('should be numeric', () => {
    creditCarInputs.cardName = ''
    creditCarInputs.cardNumber = 'ab12'
    creditCarInputs.cardExpMonth = '12a'
    creditCarInputs.cardExpYear = '20as'
    creditCarInputs.cardCVC = '123ok'

    const validData = creditCardValidator(creditCarInputs)
    expect(validData.errors.cardName.length).toBeGreaterThan(0)
    expect(validData.errors.cardNumber.length).toBeGreaterThan(0)
    expect(validData.errors.cardExpMonth.length).toBeGreaterThan(0)
    expect(validData.errors.cardExpYear.length).toBeGreaterThan(0)
    expect(validData.errors.cardCVC.length).toBeGreaterThan(0)
    expect(validData.isValid).toBeFalsy()
  })

  it('should be valid', () => {
    creditCarInputs.cardName = 'tanmoy'
    creditCarInputs.cardNumber = '1234'
    creditCarInputs.cardExpMonth = '12'
    creditCarInputs.cardExpYear = '20'
    creditCarInputs.cardCVC = '123'

    const validData = creditCardValidator(creditCarInputs)
    expect(validData.errors.cardName.length).toBe(0)
    expect(validData.errors.cardNumber.length).toBe(0)
    expect(validData.errors.cardExpMonth.length).toBe(0)
    expect(validData.errors.cardExpYear.length).toBe(0)
    expect(validData.errors.cardCVC.length).toBe(0)
    expect(validData.isValid).toBeTruthy()
  })

  it('should be valid with spaces in card number', () => {
    creditCarInputs.cardName = 'tanmoy'
    creditCarInputs.cardNumber = '1234 12'
    creditCarInputs.cardExpMonth = '12'
    creditCarInputs.cardExpYear = '20'
    creditCarInputs.cardCVC = '123'

    const validData = creditCardValidator(creditCarInputs)
    expect(validData.errors.cardName.length).toBe(0)
    expect(validData.errors.cardNumber.length).toBe(0)
    expect(validData.errors.cardExpMonth.length).toBe(0)
    expect(validData.errors.cardExpYear.length).toBe(0)
    expect(validData.errors.cardCVC.length).toBe(0)
    expect(validData.isValid).toBeTruthy()
  })
})
