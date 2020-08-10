import { isEmpty } from '../checker'

describe('checker', () => {
  describe('isEmpty', () => {
    it('should be false with keys', () => {
      expect(isEmpty({ ok: 'ok' })).toBe(false)
    })

    it('should be true without keys', () => {
      expect(isEmpty({})).toBe(true)
    })
  })
})
