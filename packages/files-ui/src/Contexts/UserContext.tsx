import * as React from "react"
import { useCallback, useEffect } from "react"
import { useFilesApi } from "./FilesApiContext"
import { useState } from "react"

type UserContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type Profile = {
  userId: string
  firstName?: string
  lastName?: string
  publicAddress?: string
  email?: string
  createdAt?: Date
  username?: string
}

interface IUserContext {
  profile: Profile | undefined
  refreshProfile(): Promise<void>
  updateProfile: (
    firstName: string,
    lastName: string,
    // email: string,
  ) => Promise<void>
  lookupOnUsername: (username: string) => Promise<boolean | undefined>
  addUsername: (username: string) => Promise<void>
  removeUser(): void
  getProfileTitle(): string
}

const UserContext = React.createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: UserContextProps) => {
  const { filesApiClient, isLoggedIn } = useFilesApi()

  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  const refreshProfile = useCallback(async () => {
    try {
      const profileApiData = await filesApiClient.getUser()

      const profileState = {
        userId: profileApiData.uuid,
        firstName: profileApiData.first_name,
        lastName: profileApiData.last_name,
        email: profileApiData.email,
        publicAddress: profileApiData.public_address,
        createdAt: profileApiData.created_at,
        username: profileApiData.username
      }
      setProfile(profileState)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error getting profile.")
    }
  }, [filesApiClient])

  useEffect(() => {
    if (isLoggedIn) {
      refreshProfile()
        .catch(console.error)
    }
  }, [isLoggedIn, refreshProfile])

  const updateProfile = async (firstName?: string, lastName?: string) => {
    if (!profile) return Promise.reject("Profile not initialized")

    try {
      const profileData = await filesApiClient.updateUser({
        first_name: firstName || "",
        last_name: lastName || "",
        email: profile.email || "",
        username: profile.username
      })

      setProfile({
        ...profile,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        publicAddress: profileData.public_address
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(
        error && error.length
          ? error[0].message
          : "There was an error updating profile."
      )
    }
  }

  // separate function to set username
  // using the same update profile API
  const addUsername = async (username: string) => {
    if (!profile) return Promise.reject("Profile not initialized")

    try {
      await filesApiClient.updateUser({
        first_name: profile.firstName || "",
        last_name: profile.lastName || "",
        email: profile.email || "",
        username
      })

      setProfile({
        ...profile,
        username
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(
        error && error.length
          ? error[0].message
          : "There was an error setting username."
      )
    }
  }

  const lookupOnUsername = async (username: string) => {
    if (!profile) return
    try {
      await filesApiClient.lookupUser({ username })
      return true
    } catch (error) {
      return false
    }
  }

  const removeUser = useCallback(() => setProfile(undefined), [])

  const getProfileTitle = () => {
    if (profile?.publicAddress) {
      const { publicAddress } = profile
      return `${publicAddress.substr(0, 6)}...${publicAddress.substr(
        publicAddress.length - 6,
        publicAddress.length
      )}`
    } else {
      return profile?.firstName || profile?.email || ""
    }
  }

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        refreshProfile,
        removeUser,
        addUsername,
        lookupOnUsername,
        getProfileTitle
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
