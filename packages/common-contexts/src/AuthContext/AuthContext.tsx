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

type Profile = {
  firstName?: string
  lastName?: string
  publicAddress?: string
  email?: string
}

type AuthContext = {
  isLoggedIn: boolean
  isReturningUser: boolean
  selectWallet(): Promise<void>
  web3Login(): Promise<void>
  profile: Profile | undefined
  updateProfile(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<void>
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined)

const AuthProvider = ({ children }: AuthContextProps) => {
  const {
    address,
    wallet,
    onboard,
    checkIsReady,
    isReady,
    provider,
  } = useWeb3()

  const { imployApiClient } = useImployApi()
  // TODO Load these from local storage if available
  const [accessToken, setAccessToken] = useState<
    { token: string; expires: Date } | undefined
  >(undefined)
  // TODO Load these from local storage if available
  const [, setRefreshToken] = useState<
    { token: string; expires: Date } | undefined
  >(undefined)

  const [profile, setProfile] = useState<Profile | undefined>(undefined)

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

    try {
      const { token } = await imployApiClient.getWeb3Token()

      if (token) {
        // instantiate a provider here
        const signature = await signMessage(token, provider)
        const {
          access_token,
          refresh_token,
        } = await imployApiClient.postWeb3Token({
          signature: signature,
          token: token,
          public_address: address,
        })
        const profileData = await imployApiClient.getUser(access_token)

        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        setProfile({
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          email: profileData.email,
          publicAddress: profileData.public_address,
        })
        return Promise.resolve()
      }
    } catch (error) {
      return Promise.reject("There was an error logging in.")
    }
  }

  const updateProfile = async (
    firstName: string,
    lastName: string,
    email: string,
  ) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("User not logged in")

    try {
      const profileData = await imployApiClient.updateUser(accessToken.token, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      })

      setProfile({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        publicAddress: profileData.public_address,
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error updating profile.")
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
        profile,
        updateProfile,
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
