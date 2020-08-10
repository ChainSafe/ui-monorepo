import { IUser, IAppTheme } from '../types'

export const LOCALSTORAGE_KEYS = {
  authAccessToken: 'files.myApp.authAccessToken',
  authRefreshToken: 'files.myApp.authRefreshToken',
  theme: 'files.myApp.theme',
  user: 'files.myApp.user',
  walletconnect: 'walletconnect'
}

export const setTokensLocal = (accessToken: string, refreshToken: string) => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEYS.authAccessToken, accessToken)
    localStorage.setItem(LOCALSTORAGE_KEYS.authRefreshToken, refreshToken)
  } catch {
    return null
  }
}

export const setUserLocal = (user: IUser) => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEYS.user, JSON.stringify(user))
  } catch {
    return null
  }
}

export const setUserAndTokensLocal = (
  user: IUser,
  accessToken: string,
  refreshToken: string
) => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEYS.authAccessToken, accessToken)
    localStorage.setItem(LOCALSTORAGE_KEYS.user, JSON.stringify(user))
    localStorage.setItem(LOCALSTORAGE_KEYS.authRefreshToken, refreshToken)
  } catch {
    return null
  }
}

export const removeUserAndTokenLocal = () => {
  try {
    localStorage.removeItem(LOCALSTORAGE_KEYS.authAccessToken)
    localStorage.removeItem(LOCALSTORAGE_KEYS.authRefreshToken)
    localStorage.removeItem(LOCALSTORAGE_KEYS.user)
  } catch {
    return null
  }
}

export const removeLocalStorageOnLogout = () => {
  try {
    localStorage.removeItem(LOCALSTORAGE_KEYS.authAccessToken)
    localStorage.removeItem(LOCALSTORAGE_KEYS.authRefreshToken)
    localStorage.removeItem(LOCALSTORAGE_KEYS.user)
    localStorage.removeItem(LOCALSTORAGE_KEYS.walletconnect)
  } catch {
    return null
  }
}

export const getUserAndTokenLocal = () => {
  try {
    const user = localStorage.getItem(LOCALSTORAGE_KEYS.user)
    const authToken = localStorage.getItem(LOCALSTORAGE_KEYS.authAccessToken)
    const refreshToken = localStorage.getItem(
      LOCALSTORAGE_KEYS.authRefreshToken
    )
    if (user && authToken && refreshToken) {
      const jsonUser = JSON.parse(user)
      return {
        authAccessToken: authToken,
        authRefreshToken: localStorage.getItem(
          LOCALSTORAGE_KEYS.authRefreshToken
        ),
        user: jsonUser
      }
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const getAccessTokenLocal = () => {
  try {
    return localStorage.getItem(LOCALSTORAGE_KEYS.authAccessToken)
  } catch {
    return null
  }
}

export const getRefreshTokenLocal = () => {
  try {
    return localStorage.getItem(LOCALSTORAGE_KEYS.authRefreshToken)
  } catch {
    return null
  }
}

// theme functions
export const getThemeLocal = () => {
  try {
    return localStorage.getItem(LOCALSTORAGE_KEYS.theme)
  } catch {
    return null
  }
}

export const setThemeLocal = (theme: IAppTheme) => {
  try {
    return localStorage.setItem(LOCALSTORAGE_KEYS.theme, theme)
  } catch {
    return null
  }
}

export const removeThemeLocal = () => {
  try {
    return localStorage.removeItem(LOCALSTORAGE_KEYS.theme)
  } catch {
    return null
  }
}
