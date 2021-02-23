import * as React from "react"
import { useEffect } from "react"
import { useImployApi } from "../ImployApiContext"
import { useState } from "react"

type UserContextProps = {
  children: React.ReactNode | React.ReactNode[];
}

export type Profile = {
  firstName?: string;
  lastName?: string;
  publicAddress?: string;
  email?: string;
}

interface IUserContext {
  profile: Profile | undefined;
  refreshProfile(): Promise<void>;
  updateProfile(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<void>;
  removeUser(): void;
  getProfileTitle(): string;
}

const UserContext = React.createContext<IUserContext | undefined>(undefined)

const UserProvider = ({ children }: UserContextProps) => {
  const { imployApiClient, isLoggedIn } = useImployApi()

  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  useEffect(() => {
    if (isLoggedIn) {
      const retrieveProfile = async () => {
        try {
          await refreshProfile()
        } catch (err) {
          //do nothing
        }
      }
      retrieveProfile()
    }
  }, [isLoggedIn])

  const refreshProfile = async () => {
    try {
      const profileApiData = await imployApiClient.getUser()

      const profileState = {
        firstName: profileApiData.first_name,
        lastName: profileApiData.last_name,
        email: profileApiData.email,
        publicAddress: profileApiData.public_address
      }
      setProfile(profileState)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject("There was an error getting profile.")
    }
  }

  const updateProfile = async (
    firstName?: string,
    lastName?: string,
    email?: string
  ) => {
    if (!profile) return Promise.reject("Profile not initialized")

    try {
      const profileData = await imployApiClient.updateUser({
        first_name: firstName || "",
        last_name: lastName || "",
        email: email || ""
      })

      setProfile({
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

  const removeUser = () => {
    setProfile(undefined)
  }

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
