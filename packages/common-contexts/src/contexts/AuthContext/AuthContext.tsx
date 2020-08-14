import * as React from 'react'
import { useState, useEffect } from 'react'

type AuthContextProps = {
  apiUrl: string
  children: React.ReactNode
}

type AuthApi = {
  // Use Type definition from the
}

type AuthContext = {
  authApiClient?: AuthApi
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined)

const AuthProvider = ({ children }: AuthContextProps) => {
  const [authApiClient, setAuthApiClient] = useState<AuthApi | undefined>(
    undefined
  )
  // Initialize Auth Context
  useEffect(() => {
    const initializeAuth = async () => {
      setAuthApiClient({})
    }

    initializeAuth()
  }, [])

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
