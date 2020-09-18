import * as React from "react"
import { useAuth } from "../AuthContext"
import { useImployApi } from "../ImployApiContext"
import {
  AddFileResponse,
  FileRequest,
} from "../ImployApiContext/ImployApiClient"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type DriveContext = {
  // Upload file
  uploadFile(
    file?: string,
    path?: string,
    type?: string,
    update?: boolean,
  ): Promise<AddFileResponse>
  // Create folder
  createFolder(body: FileRequest): Promise<void>
  // Rename file
  renameFile(body: FileRequest): Promise<void>
  // Move file
  moveFile(body: FileRequest): Promise<void>
  // Delete file
  deleteFile(body: FileRequest): Promise<void>
  // Download file
  downloadFile(body: FileRequest): Promise<void>
  // Get list of files and folders for a path
  list(path: string): Promise<any>
}

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const { imployApiClient } = useImployApi()
  const { accessToken } = useAuth()

  const uploadFile = async (
    file: string, // this doesnt seem right
    path?: string,
    type?: string,
    update?: boolean,
  ) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      // TODO handle the upload and refresh list of files at path.
      return imployApiClient.addFile(accessToken, file, path, type, update)
    } catch (error) {
      return Promise.reject()
    }
  }

  const createFolder = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      // TODO handle the upload and refresh list of files at path.
      return imployApiClient.addDirectory(accessToken, body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const renameFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      return imployApiClient.moveObject(accessToken, body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const moveFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      return imployApiClient.moveObject(accessToken, body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const deleteFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      return imployApiClient.removeObject(accessToken, body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const downloadFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      // TODO Confirm the return here. Might need to update the API spec.
      return imployApiClient.getFileContent(accessToken, body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const list = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")
    if (!accessToken) return Promise.reject("No access token")

    try {
      // TODO Confirm the return here. Might need to update the API spec.
      return imployApiClient.getChildList(accessToken, body)
    } catch (error) {
      return Promise.reject()
    }
  }

  return (
    <DriveContext.Provider
      value={{
        uploadFile,
        createFolder,
        renameFile,
        moveFile,
        deleteFile,
        downloadFile,
        list,
      }}
    >
      {children}
    </DriveContext.Provider>
  )
}

const useDrive = () => {
  const context = React.useContext(DriveContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}

export { DriveProvider, useDrive }
