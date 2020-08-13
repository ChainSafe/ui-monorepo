import { isTokenValid, getDecodedAccessToken } from '../authToken'
import jwt from 'jsonwebtoken'

describe('auth token', () => {
  let tokenValid: string
  let tokenValidExpired: string

  beforeAll(() => {
    tokenValid = jwt.sign(
      {
        name: 'John Doe'
      },
      'secret'
    )

    tokenValidExpired = jwt.sign(
      {
        name: 'John Doe'
      },
      'secret',
      { expiresIn: '-1s' }
    )
  })

  describe('decode token', () => {
    it('should be valid on right token', () => {
      const expected = { name: 'John Doe' }
      const received = getDecodedAccessToken(tokenValidExpired)
      expect(received).toMatchObject(expected)
    })

    it('should not be valid on wrong token', () => {
      const tokenParts = tokenValid.split('.')
      tokenParts[1] = tokenParts[1] + 's'
      const nonValidToken = tokenParts.join('.')
      const received = getDecodedAccessToken(`${nonValidToken}`)
      expect(received).toBe(null)
    })
  })

  describe('token expiration check', () => {
    it('should be valid on right token without expiration', () => {
      const received = isTokenValid(tokenValid)
      expect(received).toBe(true)
    })

    it('should be valid on token with expiration', () => {
      const received = isTokenValid(tokenValid)
      expect(received).toBe(true)
    })

    it('should be expired on wrong token', () => {
      const received = isTokenValid(tokenValidExpired)
      expect(received).toBe(false)
    })

    it('should be false for null token', () => {
      const received = isTokenValid('')
      expect(received).toBe(false)
    })
  })
})
