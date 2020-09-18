import * as React from "react"
import { useImployApi } from "../ImployApiContext"

type FilesContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type FilesContext = {}

const FilesContext = React.createContext<FilesContext | undefined>(undefined)

const FilesProvider = ({ children }: FilesContextProps) => {
  const { imployApiClient } = useImployApi()

  return <FilesContext.Provider value={{}}>{children}</FilesContext.Provider>
}

const useFiles = () => {
  const context = React.useContext(FilesContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export { FilesProvider, useFiles }
