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
  web3Login(): Promise<void>
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined)

const AuthProvider = ({ children }: AuthContextProps) => {
  const { provider, address, wallet, onboard, checkIsReady } = useWeb3()

  const { imployApiClient } = useImployApi()
  // TODO Load these from local storage if available
  const [accessToken, setAccessToken] = useState<
    { token: string; expires: Date } | undefined
  >(undefined)
  // TODO Load these from local storage if available
  const [, setRefreshToken] = useState<
    { token: string; expires: Date } | undefined
  >(undefined)

  const web3Login = async () => {
    try {
      await web3Login()
    } catch (error) {
      // setError("There was an error connecting")
    }

    if (!imployApiClient) return Promise.reject("Dependencies not initialized")

    if (!provider || !address) {
      if (onboard) {
        let walletReady = !!wallet
        if (!walletReady) {
          walletReady = await onboard.walletSelect()
        }
        walletReady && (await checkIsReady())
      }
    }

    if (provider) {
      const { token } = await imployApiClient.getWeb3Token()

      if (token) {
        const signature = await signMessage(token, provider)
        const {
          access_token,
          refresh_token,
        } = await imployApiClient.postWeb3Token({
          signature: signature,
          token: token,
          public_address: address,
        })

        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        return Promise.resolve()
      }
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
        web3Login: web3Login,
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
