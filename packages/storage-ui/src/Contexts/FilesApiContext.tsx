import { useWeb3 } from "@chainsafe/web3-context"
import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { IFilesApiClient, FilesApiClient, Token, IdentityProvider, OAuthIdentityToken } from "@chainsafe/files-api-client"
import jwtDecode from "jwt-decode"
import axios from "axios"
import { decryptFile } from "../Utils/encryption"
import { useLocalStorage, useSessionStorage } from "@chainsafe/browser-storage-hooks"
export type { IdentityProvider as OAuthProvider }

const tokenStorageKey = "csf.refreshToken"
const isReturningUserStorageKey = "csf.isReturningUser"

type FilesApiContextProps = {
  apiUrl?: string
  withLocalStorage?: boolean
  children: React.ReactNode | React.ReactNode[]
}

type FilesApiContext = {
  filesApiClient: IFilesApiClient
  isLoggedIn: boolean | undefined
  secured: boolean | undefined
  isReturningUser: boolean
  selectWallet: () => Promise<void>
  resetAndSelectWallet: () => Promise<void>
  getProviderUrl: (provider: OAuthIdentityToken) => Promise<string>
  loginWithGithub: (code: string, state: string) => Promise<void>
  loginWithGoogle: (
    code: string,
    state: string,
    scope: string | undefined,
    authUser: string | undefined,
    hd: string | undefined,
    prompt: string | undefined,
  ) => Promise<void>
  loginWithFacebook: (code: string, state: string) => Promise<void>
  logout: () => void
}

const FilesApiContext = React.createContext<FilesApiContext | undefined>(undefined)

const FilesApiProvider = ({ apiUrl, withLocalStorage = true, children }: FilesApiContextProps) => {
  const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === "true"

  const { wallet, onboard, checkIsReady, isReady } = useWeb3()
  const { localStorageRemove, localStorageGet, localStorageSet } = useLocalStorage()
  const { sessionStorageRemove, sessionStorageGet, sessionStorageSet } = useSessionStorage()

  // initializing api
  const initialAxiosInstance = useMemo(() => axios.create({
    // Disable the internal Axios JSON de serialization as this is handled by the client
    transformResponse: []
  }), [])

  const initialApiClient = useMemo(() => {
    return new FilesApiClient({}, apiUrl, initialAxiosInstance)
  }, [apiUrl, initialAxiosInstance]
  )

  const [filesApiClient, setFilesApiClient] = useState<FilesApiClient>(initialApiClient)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // access tokens
  const [accessToken, setAccessToken] = useState<Token | undefined>(undefined)
  const [secured, setSecured] = useState<boolean | undefined>(undefined)
  const [refreshToken, setRefreshToken] = useState<Token | undefined>(undefined)
  const [decodedRefreshToken, setDecodedRefreshToken] = useState<
    { exp: number; enckey?: string; mps?: string; uuid: string } | undefined
  >(undefined)

  // returning user
  const isReturningUserLocal = localStorageGet(isReturningUserStorageKey)
  const [isReturningUser, setIsReturningUser] = useState(isReturningUserLocal ? true : false)

  const setTokensAndSave = useCallback((accessToken: Token, refreshToken: Token) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    refreshToken.token && withLocalStorage && localStorageSet(tokenStorageKey, refreshToken.token)
    !withLocalStorage && sessionStorageSet(tokenStorageKey, refreshToken.token)
    accessToken.token && filesApiClient.setToken(accessToken.token)
  }, [filesApiClient, localStorageSet, sessionStorageSet, withLocalStorage])

  const setReturningUser = () => {
    // set returning user
    localStorageSet(isReturningUserStorageKey, "returning")
    setIsReturningUser(true)
  }

  useEffect(() => {
    const initializeApiClient = async () => {
      const axiosInstance = axios.create({
        // Disable the internal Axios JSON de serialization as this is handled by the client
        transformResponse: []
      })

      axiosInstance.interceptors.response.use(
        (response) => {
          return response
        },
        async (error) => {
          if (!error?.config?._retry && error?.response?.status === 401 && !maintenanceMode) {
            error.config._retry = true
            const refreshTokenLocal =
              (withLocalStorage)
                ? localStorageGet(tokenStorageKey)
                : sessionStorageGet(tokenStorageKey)
            if (refreshTokenLocal) {
              const refreshTokenApiClient = new FilesApiClient(
                {},
                apiUrl,
                axiosInstance
              )
              try {
                const {
                  access_token,
                  refresh_token
                } = await refreshTokenApiClient.getRefreshToken({
                  refresh: refreshTokenLocal
                })

                setTokensAndSave(access_token, refresh_token)
                error.response.config.headers.Authorization = `Bearer ${access_token.token}`
                return axios(error.response.config)
              } catch (err) {
                localStorageRemove(tokenStorageKey)
                !withLocalStorage && sessionStorageRemove(tokenStorageKey)
                setRefreshToken(undefined)
                return Promise.reject(error)
              }
            } else {
              localStorageRemove(tokenStorageKey)
              !withLocalStorage && sessionStorageRemove(tokenStorageKey)
              setRefreshToken(undefined)
              return Promise.reject(error)
            }
          }
          return Promise.reject(error)
        }
      )

      const apiClient = new FilesApiClient({}, apiUrl, axiosInstance)
      const savedRefreshToken = localStorageGet(tokenStorageKey)
      setFilesApiClient(apiClient)
      if (!maintenanceMode && savedRefreshToken) {
        try {
          const {
            access_token,
            refresh_token
          } = await apiClient.getRefreshToken({ refresh: savedRefreshToken })

          setTokensAndSave(access_token, refresh_token)
        } catch (error) {
          console.error("There was an error refreshing the saved token")
          console.error(error)
        }
      }
      setIsLoadingUser(false)
    }

    initializeApiClient()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectWallet = async () => {
    if (onboard && !isReady) {
      let walletSelected = !!wallet
      if (!walletSelected) {
        walletSelected = await onboard.walletSelect()
      }
      walletSelected && (await checkIsReady())
    }
  }

  const resetAndSelectWallet = async () => {
    if (onboard) {
      const walletReady = await onboard.walletSelect()
      walletReady && (await checkIsReady())
    }
  }

  const thresholdKeyLogin = async (
    signature: string,
    identityToken: string,
    publicKey: string
  ) => {
    if (maintenanceMode) {
      throw new Error("App is undergoing maintenance")
    }
    try {
      const {
        access_token,
        refresh_token
      } = await filesApiClient.verifyServiceIdentityToken({
        signature: signature,
        public_key: publicKey,
        service_identity_token: identityToken
      })
      setTokensAndSave(access_token, refresh_token)
      setReturningUser()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  useEffect(() => {
    if (refreshToken && refreshToken.token) {
      try {
        const decoded = jwtDecode<{ mps?: string; enckey?: string; exp: number; uuid: string }>(
          refreshToken.token
        )

        setDecodedRefreshToken(decoded)
      } catch (error) {
        console.error("Error decoding access token")
      }
    }
  }, [refreshToken])

  useEffect(() => {
    if (accessToken && accessToken.token && filesApiClient) {
      filesApiClient?.setToken(accessToken.token)
      const decodedAccessToken = jwtDecode<{ perm: { secured?: string } }>(
        accessToken.token
      )
      if (decodedAccessToken.perm.secured === "true") {
        setSecured(true)
      } else {
        setSecured(false)
      }
    }
  }, [accessToken, filesApiClient])

  const isLoggedIn = () => {
    if (isLoadingUser) {
      return undefined
    }
    if (!decodedRefreshToken) {
      return false
    } else {
      try {
        const isLoggedIn = Date.now() / 1000 < decodedRefreshToken.exp
        return isLoggedIn
      } catch (error) {
        return false
      }
    }
  }

  const getProviderUrl = async (provider: OAuthIdentityToken) => {
    try {
      const { url } = await filesApiClient.getOauth2Provider(provider)
      return Promise.resolve(url)
    } catch {
      return Promise.reject("There was an error logging in")
    }
  }

  const loginWithGithub = async (code: string, state: string) => {
    try {
      const {
        access_token,
        refresh_token
      } = await filesApiClient.postOauth2CodeGithub(code, state)
      setTokensAndSave(access_token, refresh_token)
      setReturningUser()
      return Promise.resolve()
    } catch {
      return Promise.reject("There was an error logging in")
    }
  }

  const loginWithGoogle = async (
    code: string,
    state: string,
    scope: string | undefined,
    authUser: string | undefined,
    hd: string | undefined,
    prompt: string | undefined
  ) => {
    try {
      const {
        access_token,
        refresh_token
      } = await filesApiClient.postOauth2CodeGoogle(
        code,
        state,
        scope,
        authUser,
        hd,
        prompt
      )

      setTokensAndSave(access_token, refresh_token)
      setReturningUser()
      return Promise.resolve()
    } catch (err) {
      return Promise.reject("There was an error logging in")
    }
  }

  const loginWithFacebook = async (code: string, state: string) => {
    try {
      const {
        access_token,
        refresh_token
      } = await filesApiClient.postOauth2CodeFacebook(code, state)

      setTokensAndSave(access_token, refresh_token)
      setReturningUser()
      return Promise.resolve()
    } catch (err) {
      return Promise.reject("There was an error logging in")
    }
  }

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setDecodedRefreshToken(undefined)
    filesApiClient.setToken("")
    localStorageRemove(tokenStorageKey)
    !withLocalStorage && sessionStorageRemove(tokenStorageKey)
  }

  const secureThresholdKeyAccount = async (encryptedKey: string) => {
    try {
      if (decodedRefreshToken && refreshToken) {
        await filesApiClient.secure({
          encryption_key: encryptedKey
        })

        const {
          access_token,
          refresh_token
        } = await filesApiClient.getRefreshToken({
          refresh: refreshToken.token
        })

        setTokensAndSave(access_token, refresh_token)
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  const validateMasterPassword = async (
    candidatePassword: string
  ): Promise<boolean> => {
    if (!decodedRefreshToken || !decodedRefreshToken.mps) return false
    try {
      const toDecryptArray = Buffer.from(decodedRefreshToken.mps, "base64")
      const decrypted = await decryptFile(toDecryptArray, candidatePassword)
      if (decrypted) {
        const decryptedUuid = new TextDecoder().decode(decrypted)
        return decodedRefreshToken.uuid === decryptedUuid
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  return (
    <FilesApiContext.Provider
      value={{
        filesApiClient,
        isLoggedIn: isLoggedIn(),
        secured,
        isReturningUser: isReturningUser,
        loginWithGithub,
        loginWithGoogle,
        loginWithFacebook,
        selectWallet,
        resetAndSelectWallet,
        getProviderUrl,
        logout
      }}
    >
      {children}
    </FilesApiContext.Provider>
  )
}

const useFilesApi = () => {
  const context = React.useContext(FilesApiContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export { FilesApiProvider, useFilesApi }

