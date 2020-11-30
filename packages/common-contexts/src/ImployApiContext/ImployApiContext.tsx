import { useWeb3 } from "@chainsafe/web3-context"
import * as React from "react"
import { useState, useEffect } from "react"
import {
  IImployApiClient,
  ImployApiClient,
  Token,
  Provider,
} from "@imploy/api-client"
import jwtDecode from "jwt-decode"
import { signMessage } from "./utils"
import axios from "axios"

export { Provider as OAuthProvider }

const testLocalStorage = () => {
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

const tokenStorageKey = "csf.refreshToken"
const isReturningUserStorageKey = "csf.isReturningUser"

type ImployApiContextProps = {
  apiUrl?: string
  children: React.ReactNode | React.ReactNode[]
}

type ImployApiContext = {
  imployApiClient: IImployApiClient
  isLoggedIn: boolean | undefined
  isReturningUser: boolean
  selectWallet(): Promise<void>
  resetAndSelectWallet(): Promise<void>
  web3Login(): Promise<void>
  getProviderUrl(provider: Provider): Promise<string>
  loginWithGithub(code: string, state: string): Promise<void>
  loginWithGoogle(
    code: string,
    state: string,
    scope: string | undefined,
    authUser: string | undefined,
    hd: string | undefined,
    prompt: string | undefined,
  ): Promise<void>
  loginWithFacebook(code: string, state: string): Promise<void>
  logout(): void
}

const ImployApiContext = React.createContext<ImployApiContext | undefined>(
  undefined,
)

const ImployApiProvider = ({ apiUrl, children }: ImployApiContextProps) => {
  const { wallet, onboard, checkIsReady, isReady, provider } = useWeb3()
  const canUseLocalStorage = testLocalStorage()
  // initializing api
  const initialAxiosInstance = axios.create({
    // Disable the internal Axios JSON deserialization as this is handled by the client
    transformResponse: [],
  })
  const initialApiClient = new ImployApiClient({}, apiUrl, initialAxiosInstance)

  const [imployApiClient, setImployApiClient] = useState<ImployApiClient>(
    initialApiClient,
  )
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // access tokens
  const [accessToken, setAccessToken] = useState<Token | undefined>(undefined)
  const [decodedRefreshToken, setDecodedRefreshToken] = useState<
    { exp: number } | undefined
  >(undefined)
  const [refreshToken, setRefreshToken] = useState<Token | undefined>(undefined)

  // returning user
  const isReturningUserLocal =
    canUseLocalStorage && localStorage.getItem(isReturningUserStorageKey)
  const [isReturningUser, setIsReturningUser] = useState(
    isReturningUserLocal ? true : false,
  )

  const setTokensAndSave = (accessToken: Token, refreshToken: Token) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    refreshToken.token &&
      canUseLocalStorage &&
      localStorage.setItem(tokenStorageKey, refreshToken.token)

    accessToken.token && imployApiClient.setToken(accessToken.token)
  }

  const setReturningUser = () => {
    // set returning user
    canUseLocalStorage &&
      localStorage.setItem(isReturningUserStorageKey, "returning")
    setIsReturningUser(true)
  }

  useEffect(() => {
    const initializeApiClient = async () => {
      const axiosInstance = axios.create({
        // Disable the internal Axios JSON deserialization as this is handled by the client
        transformResponse: [],
      })

      axiosInstance.interceptors.response.use(
        (response) => {
          return response
        },
        async (error) => {
          if (!error.config._retry && error.response.status === 401) {
            error.config._retry = true
            const refreshTokenLocal =
              canUseLocalStorage && localStorage.getItem(tokenStorageKey)
            if (refreshTokenLocal) {
              const refreshTokenApiClient = new ImployApiClient(
                {},
                apiUrl,
                axiosInstance,
              )
              try {
                const {
                  access_token,
                  refresh_token,
                } = await refreshTokenApiClient.getRefreshToken(
                  refreshTokenLocal,
                )
                if (access_token && refresh_token) {
                  setTokensAndSave(access_token, refresh_token)
                  error.response.config.headers.Authorization = `Bearer ${access_token.token}`
                  return axios(error.response.config)
                } else {
                  throw "Tokens missing"
                }
              } catch (err) {
                canUseLocalStorage && localStorage.removeItem(tokenStorageKey)
                setRefreshToken(undefined)
                return Promise.reject(error)
              }
            } else {
              canUseLocalStorage && localStorage.removeItem(tokenStorageKey)
              setRefreshToken(undefined)
              return Promise.reject(error)
            }
          }
          return Promise.reject(error)
        },
      )
      const savedRefreshToken =
        canUseLocalStorage && localStorage.getItem(tokenStorageKey)
      const apiClient = new ImployApiClient({}, apiUrl, axiosInstance)
      setImployApiClient(apiClient)
      if (savedRefreshToken) {
        try {
          const {
            access_token,
            refresh_token,
          } = await apiClient.getRefreshToken(savedRefreshToken)
          if (access_token && refresh_token) {
            setTokensAndSave(access_token, refresh_token)
          } else {
            throw "Tokens not found"
          }
        } catch (error) {}
      }
      setIsLoadingUser(false)
    }

    initializeApiClient()
  }, [])

  const selectWallet = async () => {
    if (onboard && !isReady) {
      let walletReady = !!wallet
      if (!walletReady) {
        walletReady = await onboard.walletSelect()
      }
      walletReady && (await checkIsReady())
    }
  }

  const resetAndSelectWallet = async () => {
    if (onboard) {
      let walletReady = await onboard.walletSelect()
      walletReady && (await checkIsReady())
    }
  }

  const web3Login = async () => {
    if (!provider) return Promise.reject("No wallet is selected")

    if (!isReady) {
      const connected = await checkIsReady()
      if (!connected) return Promise.reject("You need to allow the connection")
    }

    try {
      const { token } = await imployApiClient.getWeb3Token()

      if (token) {
        const signature = await signMessage(token, provider)
        const addresses = await provider.listAccounts()
        const {
          access_token,
          refresh_token,
        } = await imployApiClient.postWeb3Token({
          signature: signature,
          token: token,
          public_address: addresses[0],
        })
        if (access_token && refresh_token) {
          setTokensAndSave(access_token, refresh_token)
          setReturningUser()
          return Promise.resolve()
        } else {
          throw "Tokens not found"
        }
      }
    } catch (error) {
      return Promise.reject("There was an error logging in.")
    }
  }

  useEffect(() => {
    if (refreshToken && refreshToken.token) {
      try {
        const decoded = jwtDecode<any>(refreshToken.token)
        setDecodedRefreshToken(decoded)
      } catch (error) {
        console.log("Error decoding access token")
      }
    }
  }, [refreshToken])

  useEffect(() => {
    if (accessToken && accessToken.token && imployApiClient) {
      imployApiClient?.setToken(accessToken.token)
    }
  }, [accessToken])

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

  const getProviderUrl = async (provider: Provider) => {
    try {
      const { url } = await imployApiClient.getOauth2Provider(provider)
      return Promise.resolve(url)
    } catch {
      return Promise.reject("There was an error logging in")
    }
  }

  const loginWithGithub = async (code: string, state: string) => {
    try {
      const {
        access_token,
        refresh_token,
      } = await imployApiClient.postOauth2CodeGithub(code, state)
      if (access_token && refresh_token) {
        setTokensAndSave(access_token, refresh_token)
        setReturningUser()
        return Promise.resolve()
      } else {
        throw "Tokens not found"
      }
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
    prompt: string | undefined,
  ) => {
    try {
      const {
        access_token,
        refresh_token,
      } = await imployApiClient.postOauth2CodeGoogle(
        code,
        state,
        scope,
        authUser,
        hd,
        prompt,
      )

      if (access_token && refresh_token) {
        setTokensAndSave(access_token, refresh_token)
        setReturningUser()
        return Promise.resolve()
      } else {
        throw "Tokens not found"
      }
    } catch (err) {
      return Promise.reject("There was an error logging in")
    }
  }

  const loginWithFacebook = async (code: string, state: string) => {
    try {
      const {
        access_token,
        refresh_token,
      } = await imployApiClient.postOauth2CodeFacebook(code, state)

      if (access_token && refresh_token) {
        setTokensAndSave(access_token, refresh_token)
        setReturningUser()
        return Promise.resolve()
      } else {
        throw "Tokens not found"
      }
    } catch (err) {
      return Promise.reject("There was an error logging in")
    }
  }

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setDecodedRefreshToken(undefined)
    canUseLocalStorage && localStorage.removeItem(tokenStorageKey)
  }

  return (
    <ImployApiContext.Provider
      value={{
        imployApiClient: imployApiClient,
        isLoggedIn: isLoggedIn(),
        isReturningUser: isReturningUser,
        web3Login,
        loginWithGithub,
        loginWithGoogle,
        loginWithFacebook,
        selectWallet,
        resetAndSelectWallet,
        getProviderUrl,
        logout,
      }}
    >
      {children}
    </ImployApiContext.Provider>
  )
}

const useImployApi = () => {
  const context = React.useContext(ImployApiContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export { ImployApiProvider, useImployApi }
