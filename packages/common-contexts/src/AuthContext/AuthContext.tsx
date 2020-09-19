import * as React from "react"
// import { useEffect } from "react"
import { useWeb3 } from "@chainsafe/web3-context"
import { useImployApi } from "../ImployApiContext"
import { signMessage } from "./utils"
import { useState, useMemo } from "react"
import jwtDecode from "jwt-decode"

type AuthContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type AuthContext = {
  isLoggedIn: boolean
  isReturningUser: boolean
  selectWallet(): Promise<void>
  web3Login(): Promise<void>
  accessToken?: string
  refreshAccessToken(): Promise<void>
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined)

const AuthProvider = ({ children }: AuthContextProps) => {
  const { wallet, onboard, checkIsReady, isReady, provider } = useWeb3()

  const { imployApiClient } = useImployApi()
  // TODO Load these from local storage if available
  const [accessToken, setAccessToken] = useState<
    { token: string; expires: Date } | undefined
  >(undefined)
  // TODO Load these from local storage if available
  const [refreshToken, setRefreshToken] = useState<
    { token: string; expires: Date } | undefined
  >(undefined)

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

        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        return Promise.resolve()
      }
    } catch (error) {
      return Promise.reject("There was an error logging in.")
    }
  }

  const refreshAccessToken = async () => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!refreshToken) return Promise.reject("No refresh token available")
    try {
      const {
        access_token,
        refresh_token,
      } = await imployApiClient.getRefreshToken(refreshToken?.token)
      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const isLoggedIn = useMemo(() => {
    if (!accessToken) {
      return false
    } else {
      try {
        // TODO Get the token schema for decode
        const decodedToken = jwtDecode<any>(accessToken.token)
        const isLoggedIn = Date.now() / 1000 < decodedToken.exp
        return isLoggedIn
      } catch (error) {
        return false
      }
    }
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        isReturningUser: false,
        web3Login,
        selectWallet,
        accessToken: accessToken?.token,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }
