import { useWeb3 } from "@chainsafe/web3-context"
import * as React from "react"
import { useState, useEffect } from "react"
import { ImployApiClient, Token } from "./ImployApiClient"
import jwtDecode from "jwt-decode"
import { signMessage } from "./utils"
import axios from "axios"

const tokenStorageKey = "csf.refreshToken"

type ImployApiContextProps = {
  apiUrl?: string
  children: React.ReactNode | React.ReactNode[]
}

type ImployApiContext = {
  imployApiClient?: ImployApiClient
  isLoggedIn: boolean
  isReturningUser: boolean
  selectWallet(): Promise<void>
  web3Login(): Promise<void>
}

const ImployApiContext = React.createContext<ImployApiContext | undefined>(
  undefined,
)

const ImployApiProvider = ({ apiUrl, children }: ImployApiContextProps) => {
  const { wallet, onboard, checkIsReady, isReady, provider } = useWeb3()
  const [imployApiClient, setImployApiClient] = useState<
    ImployApiClient | undefined
  >(undefined)

  const [accessToken, setAccessToken] = useState<Token | undefined>(undefined)
  const [decodedAccessToken, setDecodedAccessToken] = useState<
    { exp: number } | undefined
  >(undefined)
  const [refreshToken, setRefreshToken] = useState<Token | undefined>(undefined)
  const [isReturningUser, setIsReturningUser] = useState(false)

  const setTokensAndSave = (
    accessToken: Token,
    refreshToken: Token,
    apiClient: ImployApiClient,
  ) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    localStorage.setItem(tokenStorageKey, refreshToken.token)
    apiClient.setToken(accessToken.token)
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
            if (refreshToken?.token && imployApiClient) {
              try {
                const {
                  access_token,
                  refresh_token,
                } = await imployApiClient.getRefreshToken(refreshToken.token)
                imployApiClient.setToken(access_token.token)
                setAccessToken(access_token)
                setRefreshToken(refresh_token)
                error.response.config.headers.Authorization = `Bearer ${access_token.token}`
                return axios(error.response.config) //TODO: Confirm with @tanmoytb whether this retries the call with the new token
              } catch (err) {
                // removeUserAndTokenLocal()
                return Promise.reject(error)
              }
            } else {
              // removeUserAndTokenLocal()
              return Promise.reject(error)
            }
          }
          // return Error object with Promise
          return Promise.reject(error)
        },
      )
      const apiClient = new ImployApiClient({}, apiUrl, axiosInstance)
      const savedRefreshToken = localStorage.getItem(tokenStorageKey)
      if (savedRefreshToken) {
        setIsReturningUser(true)
        try {
          const {
            access_token,
            refresh_token,
          } = await apiClient.getRefreshToken(savedRefreshToken)

          setTokensAndSave(access_token, refresh_token, apiClient)
        } catch (error) {}
      }
      setImployApiClient(apiClient)
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

  const web3Login = async () => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
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
        setTokensAndSave(access_token, refresh_token, imployApiClient)
        return Promise.resolve()
      }
    } catch (error) {
      return Promise.reject("There was an error logging in.")
    }
  }

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode<any>(accessToken.token)
        setDecodedAccessToken(decoded)
      } catch (error) {
        console.log("Error decoding access token")
      }
    }
  }, [accessToken])

  const isLoggedIn = () => {
    if (!accessToken || !decodedAccessToken) {
      return false
    } else {
      try {
        const isLoggedIn = Date.now() / 1000 < decodedAccessToken.exp
        return isLoggedIn
      } catch (error) {
        return false
      }
    }
  }

  return (
    <ImployApiContext.Provider
      value={{
        imployApiClient: imployApiClient,
        isLoggedIn: isLoggedIn(),
        isReturningUser: isReturningUser,
        web3Login,
        selectWallet,
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
