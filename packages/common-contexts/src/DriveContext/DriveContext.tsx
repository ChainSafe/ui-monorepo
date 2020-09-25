import React, { useState } from "react"
import { useImployApi } from "../ImployApiContext"
import {
  FileResponse,
  FileRequest,
  FileParameter,
} from "../ImployApiContext/ImployApiClient"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type DriveContext = {
  // Upload file
  uploadFile(
    file?: FileParameter,
    path?: string,
    type?: string,
    update?: boolean,
  ): Promise<FileResponse>
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
  list(body: FileRequest): Promise<any>
  currentPath: string
  setCurrentPath(newPath: string): void
}

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const { imployApiClient } = useImployApi()

  const [currentPath, setCurrentPath] = useState("/")

  const uploadFile = async (
    file: FileParameter,
    path?: string,
    type?: string,
    update?: boolean,
  ) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO handle the upload and refresh list of files at path.
      return imployApiClient.addFile(file, path, type, update)
    } catch (error) {
      return Promise.reject()
    }
  }

  const createFolder = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO handle the upload and refresh list of files at path.
      return imployApiClient.addDirectory(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const renameFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      return imployApiClient.moveObject(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const moveFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      return imployApiClient.moveObject(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const deleteFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      return imployApiClient.removeObject(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const downloadFile = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO Confirm the return here. Might need to update the API spec.
      return imployApiClient.getFileContent(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const list = async (body: FileRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO Confirm the return here. Might need to update the API spec.
      return imployApiClient.getChildList(body)
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
        currentPath,
        setCurrentPath,
      }}
    >
      {children}
    </DriveContext.Provider>
  )
}

const useDrive = () => {
  const context = React.useContext(DriveContext)
  if (context === undefined) {
    throw new Error("useDrive must be used within a DriveProvider")
  }
  return context
}

export { DriveProvider, useDrive }
