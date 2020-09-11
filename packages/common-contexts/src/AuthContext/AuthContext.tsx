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
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined)

const AuthProvider = ({ children }: AuthContextProps) => {
  const { provider, address } = useWeb3()
  const { imployApiClient } = useImployApi()
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined) // TODO Load these from local storage if available
  const [refreshToken, setRefreshToken] = useState<string | undefined>(
    undefined,
  )

  const web3Login = async () => {
    if (!imployApiClient || !provider || !address) return

    const { token } = await imployApiClient.userWeb3LoginGet()
    // TODO Fix the type definition to return a Web3Provider
    // @ts-ignore
    const signature = await signMessage(token, provider)
    const {
      access_token,
      refresh_token,
    } = await imployApiClient.userWeb3LoginPost({
      signature: signature,
      token: token,
      public_address: address,
    })

    setAccessToken(access_token)
    setRefreshToken(refresh_token)
  }

  const isLoggedIn = useMemo(() => {
    if (!accessToken) {
      return false
    } else {
      // TODO Get the token schema for decode
      const decodedToken = jwtDecode<any>(accessToken)
      const isLoggedIn = Date.now() / 1000 < decodedToken.exp
      return isLoggedIn
    }
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        isReturningUser: false,
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
