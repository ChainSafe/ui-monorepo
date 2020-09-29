import * as React from "react"
import { useEffect } from "react"
import { useImployApi } from "../ImployApiContext"
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
  refreshProfile(): Promise<void>
  updateProfile(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<void>
}

const UserContext = React.createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: UserContextProps) => {
  const { imployApiClient, isLoggedIn } = useImployApi()

  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  useEffect(() => {
    if (isLoggedIn && imployApiClient) {
      refreshProfile()
    }
  }, [isLoggedIn, imployApiClient])

  const refreshProfile = async () => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      const profileData = await imployApiClient.getUser()

      setProfile({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        publicAddress: profileData.public_address,
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error getting profile.")
    }
  }

  const updateProfile = async (
    firstName?: string,
    lastName?: string,
    email?: string,
  ) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!profile) return Promise.reject("Profile not initialized")

    try {
      const profileData = await imployApiClient.updateUser({
        first_name: firstName || "",
        last_name: lastName || "",
        email: email || "",
      })

      return Promise.reject("There was an error updating profile.")
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

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        refreshProfile,
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
