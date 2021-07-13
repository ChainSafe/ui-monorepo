import { useWeb3 } from "@chainsafe/web3-context"
import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { IFilesApiClient, FilesApiClient, Token, IdentityProvider, IdentityToken } from "@chainsafe/files-api-client"
import jwtDecode from "jwt-decode"
import axios from "axios"
import { useLocalStorage, useSessionStorage } from "@chainsafe/browser-storage-hooks"
import { createHandler, ILoginHandler, LoginWindowResponse, LOGIN_TYPE } from "@toruslabs/torus-direct-web-sdk"
import { t } from "@lingui/macro"
import { capitalize, centerEllipsis } from "../Utils/StringHelpers"
export type { IdentityProvider as OAuthProvider }

const tokenStorageKey = "csg.refreshToken"

const getProviderSpecificParams = (loginType: LOGIN_TYPE):
  {typeOfLogin: LOGIN_TYPE; clientId: string; verifier: string; jwtParams?: any} => {
  switch (loginType) {
  case "google": {
    return {
      typeOfLogin: loginType,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
      verifier: ""
    }
  }
  case "github":{
    return {
      typeOfLogin: loginType,
      clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "",
      verifier: "",
      jwtParams: {
        domain: process.env.REACT_APP_AUTH0_DOMAIN || ""
      }
    }
  }
  default:{
    throw new Error(`${loginType} is unsupported`)
  }
  }
}

export interface GamingUserInfo {
  typeOfLogin: IdentityProvider
  email?: string
  publicAddress?: string
}

export type DirectAuthContextStatus = "initializing"|"initialized"|"awaiting confirmation"|"logging in"|"done"

type GamingApiContextProps = {
  apiUrl?: string
  withLocalStorage?: boolean
  children: React.ReactNode | React.ReactNode[]
}

interface ExtendedTorusResponse extends LoginWindowResponse {
  expires_in: string
}

type GamingApiContext = {
  userInfo?: GamingUserInfo
  gamingApiClient: IFilesApiClient
  isLoggedIn: boolean | undefined
  selectWallet: () => Promise<void>
  resetAndSelectWallet: () => Promise<void>
  login(loginType: IdentityProvider, tokenInfo?: {token: IdentityToken; email: string}): Promise<void>
  loggedinAs: string
  logout: () => void
  status: DirectAuthContextStatus
  resetStatus(): void
}

const GamingApiContext = React.createContext<GamingApiContext | undefined>(undefined)

const GamingApiProvider = ({ apiUrl, withLocalStorage = true, children }: GamingApiContextProps) => {
  const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === "true"

  const { wallet, onboard, checkIsReady, isReady, provider, address } = useWeb3()
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

  const [gamingApiClient, setGamingApiClient] = useState<FilesApiClient>(initialApiClient)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [loggedinAs, setLoggedinAs] = useState("")
  const [userInfo, setUserInfo] = useState<GamingUserInfo | undefined>()
  const [status, setStatus] = useState<DirectAuthContextStatus>("initialized")

  // access tokens
  const [accessToken, setAccessToken] = useState<Token | undefined>(undefined)
  const [refreshToken, setRefreshToken] = useState<Token | undefined>(undefined)
  const [decodedRefreshToken, setDecodedRefreshToken] = useState<
    { exp: number; enckey?: string; mps?: string; uuid: string } | undefined
  >(undefined)

  const setTokensAndSave = useCallback((accessToken: Token, refreshToken: Token) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    withLocalStorage
      ? localStorageSet(tokenStorageKey, refreshToken.token)
      : sessionStorageSet(tokenStorageKey, refreshToken.token)

    accessToken.token && gamingApiClient.setToken(accessToken.token)
  }, [gamingApiClient, localStorageSet, sessionStorageSet, withLocalStorage])

  useEffect(() => {
    const loginType = userInfo?.typeOfLogin as LOGIN_TYPE

    if (userInfo && loginType) {
      switch (loginType) {
      case "jwt":
        setLoggedinAs(t`Web3: ${centerEllipsis(String(address), 4)}`)
        break
      case "google":
        setLoggedinAs(`${capitalize(loginType)}: ${centerEllipsis(`${userInfo.email}`, 4)}`)
        break
      case "github":
        setLoggedinAs(`${capitalize(loginType)}: ${centerEllipsis(`${userInfo.email}`, 4)}`)
        break
      default:
        setLoggedinAs(`${centerEllipsis(`${userInfo.publicAddress}`, 4)}`)
        break
      }
    }
  }, [userInfo, address])


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
                ? localStorage.getItem(tokenStorageKey)
                : sessionStorage.getItem(tokenStorageKey)
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
      const savedRefreshToken = withLocalStorage
        ? localStorage.getItem(tokenStorageKey)
        : sessionStorage.getItem(tokenStorageKey)

      setGamingApiClient(apiClient)
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
    if (accessToken && accessToken.token && gamingApiClient) {
      gamingApiClient?.setToken(accessToken.token)
    }
  }, [accessToken, gamingApiClient])

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

  const getIdentityToken = async (
    loginType: IdentityProvider,
    tokenInfo?: {token: IdentityToken; email: string}
  ): Promise<{identityToken: IdentityToken; userInfo: any}> => {
    if (loginType === "email") {
      if (!tokenInfo) {
        throw new Error("token not provided")
      } else {
        return {
          identityToken: tokenInfo.token,
          userInfo: { email: tokenInfo?.email }
        }
      }
    }
    if (loginType === "web3") {
      let addressToUse = address

      if (!isReady  || !provider) {
        const connected = await checkIsReady()

        if (!connected || !provider) throw new Error("Unable to connect to wallet.")
      }

      const signer = provider.getSigner()
      if (!signer) throw new Error("Signer undefined")

      if(!addressToUse){
        // checkIsReady above doesn't make sure that the address is defined
        // we pull the address here to have it defined for sure
        addressToUse = await signer.getAddress()
      }

      const { token } = await gamingApiClient.getIdentityWeb3Token(addressToUse)

      if (!token) throw new Error("Token undefined")

      setStatus("awaiting confirmation")
      const signature = (wallet?.name === "WalletConnect")
        ? await signer.provider.send("personal_sign", [token, addressToUse])
        : await signer.signMessage(token)

      setStatus("logging in")
      const web3IdentityToken = await gamingApiClient.postIdentityWeb3Token({
        signature: signature,
        token: token,
        public_address: addressToUse
      })

      return {
        identityToken: web3IdentityToken,
        userInfo: { address: addressToUse }
      }

    } else {
      const providerSpecificHandlerProps = getProviderSpecificParams(loginType)

      const loginHandler: ILoginHandler = createHandler({
        ...providerSpecificHandlerProps,
        redirect_uri: `${window.location.origin}/serviceworker/redirect`,
        redirectToOpener: false,
        uxMode: "popup",
        customState: {}
      })
      setStatus("awaiting confirmation")
      const oauthIdToken = await loginHandler.handleLoginWindow({})
      setStatus("logging in")
      const userInfo = await loginHandler.getUserInfo(oauthIdToken)

      return {
        identityToken: {
          expires: (oauthIdToken as ExtendedTorusResponse).expires_in,
          token:  oauthIdToken.idToken || oauthIdToken.accessToken
        },
        userInfo
      }
    }
  }

  const login = async (loginType: IdentityProvider, tokenInfo?: {token: IdentityToken; email: string}) => {
    if (!gamingApiClient || maintenanceMode) return

    try {
      setStatus("awaiting confirmation")
      const { identityToken, userInfo } = await getIdentityToken(loginType, tokenInfo)
      const { access_token, refresh_token } = await gamingApiClient.loginUser({
        provider: loginType,
        service: "gaming",
        token: identityToken.token
      })
      setStatus("logging in")

      setUserInfo({
        typeOfLogin: loginType,
        email: userInfo.email,
        publicAddress: userInfo.address
      })
      setTokensAndSave(access_token, refresh_token)
    } catch(error) {
      console.error(error)
      throw new Error("Login Error")
    }
  }

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setDecodedRefreshToken(undefined)
    gamingApiClient.setToken("")
    localStorageRemove(tokenStorageKey)
    setLoggedinAs("")
    setStatus("initialized")
    !withLocalStorage && sessionStorageRemove(tokenStorageKey)
  }

  return (
    <GamingApiContext.Provider
      value={{
        gamingApiClient: gamingApiClient,
        isLoggedIn: isLoggedIn(),
        login,
        resetStatus: () => setStatus("initialized"),
        status,
        loggedinAs,
        userInfo,
        selectWallet,
        resetAndSelectWallet,
        logout
      }}
    >
      {children}
    </GamingApiContext.Provider>
  )
}

const useGamingApi = () => {
  const context = React.useContext(GamingApiContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}

export { GamingApiProvider, useGamingApi }
