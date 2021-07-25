import * as React from "react"
import { useCallback, useEffect } from "react"
import { useStorageApi } from "./StorageApiContext"
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
  getProfileTitle(): string
}

const UserContext = React.createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: UserContextProps) => {
  const { storageApiClient, isLoggedIn } = useStorageApi()

  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  const refreshProfile = useCallback(async () => {
    try {
      const profileApiData = await storageApiClient.getUser()

      const profileState = {
        userId: profileApiData.uuid,
        firstName: profileApiData.first_name,
        lastName: profileApiData.last_name,
        email: profileApiData.email,
        publicAddress: profileApiData.public_address?.toLowerCase(),
        createdAt: profileApiData.created_at,
        username: profileApiData.username
      }
      setProfile(profileState)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error getting profile.")
    }
  }, [storageApiClient])

  useEffect(() => {
    if (isLoggedIn) {
      refreshProfile()
        .catch(console.error)
    }
  }, [isLoggedIn, refreshProfile])

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
        refreshProfile,
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
