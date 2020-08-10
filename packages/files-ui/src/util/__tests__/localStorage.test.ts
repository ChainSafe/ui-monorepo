import {
  LOCALSTORAGE_KEYS,
  getAccessTokenLocal,
  getRefreshTokenLocal,
  getUserAndTokenLocal,
  removeLocalStorageOnLogout,
  removeUserAndTokenLocal,
  setTokensLocal,
  setUserAndTokensLocal,
  setUserLocal,
  getThemeLocal,
  setThemeLocal,
  removeThemeLocal
} from '../localstorage'

const localStorageMock = (() => {
  let store = new Map()
  let permission = true
  return {
    setPermission: (permit: boolean) => {
      permission = permit
    },

    getItem(key: string): string | undefined {
      if (!permission) {
        throw Error('not permitted')
      }
      return store.get(key)
    },

    setItem: (key: string, value: string) => {
      if (!permission) {
        throw Error('not permitted')
      }
      store.set(key, value)
    },

    clear: () => {
      if (!permission) {
        throw Error('not permitted')
      }
      store = new Map()
    },

    removeItem: (key: string) => {
      if (!permission) {
        throw Error('not permitted')
      }
      store.delete(key)
    }
  }
})()

describe('localstorage', () => {
  describe('permitted state', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      localStorageMock.setPermission(true)
    })

    it('getAccessToken should retrieve', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authAccessToken, 'token')

      expect(getAccessTokenLocal()).toEqual('token')
    })

    it('getRefreshToken should retrieve', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authRefreshToken, 'token')

      expect(getRefreshTokenLocal()).toEqual('token')
    })

    it('getUserAndToken should retrieve', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authAccessToken, 'authToken')
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.authRefreshToken,
        'refreshToken'
      )
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.user,
        JSON.stringify({ user: 'user' })
      )

      const data = getUserAndTokenLocal()
      expect(data).toEqual({
        authAccessToken: 'authToken',
        authRefreshToken: 'refreshToken',
        user: { user: 'user' }
      })
    })

    it('getTheme should retrieve', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.theme, 'theme')

      expect(getThemeLocal()).toEqual('theme')
    })

    it('setToken should set', () => {
      setTokensLocal('authToken', 'refreshToken')

      const authToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authAccessToken
      )
      const refreshToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authRefreshToken
      )

      expect(authToken).toEqual('authToken')
      expect(refreshToken).toEqual('refreshToken')
    })

    it('setTokenAndUser should set', () => {
      const user = {
        firstName: '',
        lastName: '',
        email: '',
        billing: true,
        id: '',
        verified: false
      }
      setUserAndTokensLocal(user, 'authToken', 'refreshToken')

      const authToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authAccessToken
      )
      const refreshToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authRefreshToken
      )
      const localUser = localStorageMock.getItem(LOCALSTORAGE_KEYS.user)

      expect(authToken).toEqual('authToken')
      expect(refreshToken).toEqual('refreshToken')
      expect(localUser).toEqual(JSON.stringify(user))
    })

    it('setUser should set', () => {
      const user = {
        firstName: '',
        lastName: '',
        email: '',
        billing: true,
        id: '',
        verified: false
      }
      setUserLocal(user)

      const localUser = localStorageMock.getItem(LOCALSTORAGE_KEYS.user)

      expect(localUser).toEqual(JSON.stringify(user))
    })

    it('setTheme should set', () => {
      setThemeLocal('light')

      const localUser = localStorageMock.getItem(LOCALSTORAGE_KEYS.theme)

      expect(localUser).toEqual('light')
    })

    it('removeUserAndToken should remove', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authAccessToken, 'authToken')
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.authRefreshToken,
        'refreshToken'
      )
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.user,
        JSON.stringify({ user: 'user' })
      )

      removeUserAndTokenLocal()

      const authToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authAccessToken
      )
      const refreshToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authRefreshToken
      )
      const localUser = localStorageMock.getItem(LOCALSTORAGE_KEYS.user)

      expect(authToken).toBeUndefined()
      expect(refreshToken).toBeUndefined()
      expect(localUser).toBeUndefined()
    })

    it('removeLocalStorageOnLogout should remove', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authAccessToken, 'authToken')
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.authRefreshToken,
        'refreshToken'
      )
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.user,
        JSON.stringify({ user: 'user' })
      )

      removeLocalStorageOnLogout()

      const authToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authAccessToken
      )
      const refreshToken = localStorageMock.getItem(
        LOCALSTORAGE_KEYS.authRefreshToken
      )
      const localUser = localStorageMock.getItem(LOCALSTORAGE_KEYS.user)

      expect(authToken).toBeUndefined()
      expect(refreshToken).toBeUndefined()
      expect(localUser).toBeUndefined()
    })

    it('removeTheme should remove', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.theme, 'light')

      removeThemeLocal()

      const theme = localStorageMock.getItem(LOCALSTORAGE_KEYS.theme)

      expect(theme).toBeUndefined()
    })
  })

  describe('not permitted state', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      localStorageMock.setPermission(true)
    })

    it('getAccessToken should be null', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authAccessToken, 'token')
      localStorageMock.setPermission(false)

      expect(getAccessTokenLocal()).toEqual(null)
    })

    it('getRefreshToken should be null', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authRefreshToken, 'token')
      localStorageMock.setPermission(false)

      expect(getRefreshTokenLocal()).toEqual(null)
    })

    it('getUserAndToken should be null', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.authAccessToken, 'authToken')
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.authRefreshToken,
        'refreshToken'
      )
      localStorageMock.setItem(
        LOCALSTORAGE_KEYS.user,
        JSON.stringify({ user: 'user' })
      )
      localStorageMock.setPermission(false)

      const data = getUserAndTokenLocal()
      expect(data).toEqual(null)
    })

    it('getThemeLocal should be null', () => {
      localStorageMock.setItem(LOCALSTORAGE_KEYS.theme, 'light')
      localStorageMock.setPermission(false)
      const data = getThemeLocal()
      expect(data).toEqual(null)
    })

    it('setToken should be null', () => {
      localStorageMock.setPermission(false)
      const response = setTokensLocal('authToken', 'refreshToken')

      expect(response).toEqual(null)
    })

    it('setTokenAndUser should  be null', () => {
      const user = {
        firstName: '',
        lastName: '',
        email: '',
        billing: true,
        id: '',
        verified: false
      }
      localStorageMock.setPermission(false)
      const response = setUserAndTokensLocal(user, 'authToken', 'refreshToken')

      expect(response).toEqual(null)
    })

    it('setUser should be null', () => {
      const user = {
        firstName: '',
        lastName: '',
        email: '',
        billing: true,
        id: '',
        verified: false
      }
      localStorageMock.setPermission(false)
      const response = setUserLocal(user)

      expect(response).toEqual(null)
    })

    it('setTheme should be null', () => {
      localStorageMock.setPermission(false)
      const response = setThemeLocal('light')

      expect(response).toEqual(null)
    })

    it('removeUserAndToken should be null', () => {
      localStorageMock.setPermission(false)
      const response = removeUserAndTokenLocal()

      expect(response).toEqual(null)
    })

    it('removeLocalStorageOnLogout  be null', () => {
      localStorageMock.setPermission(false)
      const response = removeLocalStorageOnLogout()

      expect(response).toEqual(null)
    })

    it('removeTheme should be null', () => {
      localStorageMock.setPermission(false)
      const response = removeThemeLocal()

      expect(response).toEqual(null)
    })
  })
})
