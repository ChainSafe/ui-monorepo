import { loginValidator, signupValidator } from '../loginValidator'

describe('loginValidator', () => {
  const loginData = {
    email: '',
    password: ''
  }
  it('should be required email and password', () => {
    const validData = loginValidator(loginData)
    expect(validData.errors.email.length).toBeGreaterThan(1)
    expect(validData.errors.password.length).toBeGreaterThan(1)
  })

  it('should be invalid email', () => {
    loginData.email = 'tom'

    const validData = loginValidator(loginData)
    expect(validData.errors.email).toContain('invalid')
  })

  it('should be empty', () => {
    loginData.email = 'tom@ch.com'
    loginData.password = '12345678'

    const validData = loginValidator(loginData)
    expect(validData.errors.email.length).toBe(0)
    expect(validData.errors.password.length).toBe(0)
    expect(validData.isValid).toBeTruthy()
  })
})

describe('signupValidator', () => {
  const signupData = {
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: ''
  }
  it('should be errors name, email and password if not data', () => {
    const validData = signupValidator(signupData)

    expect(validData.errors.email.length).toBeGreaterThan(1)
    expect(validData.errors.password.length).toBeGreaterThan(1)
  })

  it('should be invalid email', () => {
    signupData.email = 'tom'

    const validData = signupValidator(signupData)
    expect(validData.errors.email).toContain('invalid')
  })

  it('should be password 8 characters', () => {
    signupData.password = '123456'

    const validData = signupValidator(signupData)
    expect(validData.errors.password).toContain('characters')
  })

  it('should be password not match', () => {
    signupData.password = '123456789'
    signupData.passwordConfirm = '1234567890'

    const validData = signupValidator(signupData)
    expect(validData.errors.password).toContain('match')
  })

  it('should be valid', () => {
    signupData.email = 'tom@chainsafe.io'
    signupData.firstName = 'firstName'
    signupData.lastName = 'lastName'
    signupData.password = '12345678'
    signupData.passwordConfirm = '12345678'

    const validData = signupValidator(signupData)
    expect(validData.isValid).toBeTruthy()
  })
})
