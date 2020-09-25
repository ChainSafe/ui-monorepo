import * as React from "react"
import { useImployApi } from "../ImployApiContext"
import { useAuth } from "../AuthContext"
import { useState } from "react"

type UserContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type Profile = {
  firstName?: string
  lastName?: string
  publicAddress?: string
  email?: string
}

interface IUserContext {
  profile: Profile | undefined
  loaders: { gettingProfile: boolean; updatingProfile: boolean }
  getProfile(): Promise<void>
  updateProfile(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<void>
}

const UserContext = React.createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: UserContextProps) => {
  const { imployApiClient } = useImployApi()
  const { accessToken } = useAuth()

  const [profile, setProfile] = useState<Profile | undefined>(undefined)
  const [loaders, setLoaders] = useState({
    gettingProfile: false,
    updatingProfile: false,
  })

  const getProfile = async () => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("User not logged in")

    try {
      setLoaders((prevLoaders) => ({ ...prevLoaders, gettingProfile: true }))
      const profileData = await imployApiClient.getUser(accessToken)

      setProfile({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        publicAddress: profileData.public_address,
      })
      setLoaders((prevLoaders) => ({ ...prevLoaders, gettingProfile: false }))
      return Promise.resolve()
    } catch (error) {
      setLoaders((prevLoaders) => ({ ...prevLoaders, gettingProfile: false }))
      return Promise.reject("There was an error getting profile.")
    }
  }

  const updateProfile = async (
    firstName?: string,
    lastName?: string,
    email?: string,
  ) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("User not logged in")
    if (!profile) return Promise.reject("Profile not initialized")

    try {
      setLoaders((prevLoaders) => ({ ...prevLoaders, updatingProfile: true }))
      const profileData = await imployApiClient.updateUser(accessToken, {
        first_name: firstName || profile.firstName || "",
        last_name: lastName || profile.lastName || "",
        email: email || profile.email || "",
      })

      setProfile({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        publicAddress: profileData.public_address,
      })
      setLoaders((prevLoaders) => ({ ...prevLoaders, updatingProfile: false }))
      return Promise.resolve()
    } catch (error) {
      setLoaders((prevLoaders) => ({ ...prevLoaders, updatingProfile: false }))
      return Promise.reject("There was an error updating profile.")
    }
  }

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        getProfile,
        loaders,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUser = () => {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export { UserProvider, useUser }
