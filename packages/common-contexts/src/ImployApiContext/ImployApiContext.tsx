import * as React from "react"
import { useState, useEffect } from "react"
import { IImployApiClient, ImployApiClient } from "./ImployApiClientFetch"

type ImployApiContextProps = {
  apiUrl?: string
  children: React.ReactNode | React.ReactNode[]
}

type ImployApiContext = {
  imployApiClient?: IImployApiClient
}

const ImployApiContext = React.createContext<ImployApiContext | undefined>(
  undefined,
)

const ImployApiProvider = ({ apiUrl, children }: ImployApiContextProps) => {
  const [imployApiClient, setImployApiClient] = useState<
    IImployApiClient | undefined
  >(undefined)
  // Initialize Auth Context
  useEffect(() => {
    const initializeApiClient = async () => {
      const apiClient = new ImployApiClient(apiUrl)
      setImployApiClient(apiClient)
    }

    initializeApiClient()
  }, [])

  return (
    <ImployApiContext.Provider
      value={{
        imployApiClient: imployApiClient,
      }}
    >
      {children}
    </ImployApiContext.Provider>
  )
}

const useImployApi = () => {
  const context = React.useContext(ImployApiContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export { ImployApiProvider, useImployApi }
