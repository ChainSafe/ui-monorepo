import {
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  FilesRmRequest,
  FilesUploadResponse,
} from "@imploy/api-client"
import * as React from "react"
import { useImployApi } from "../ImployApiContext"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type DriveContext = {
  // Upload file
  uploadFile(file: Blob): Promise<FilesUploadResponse>
  // Create folder
  createFolder(body: FilesPathRequest): Promise<FileContentResponse>
  // Rename file
  renameFile(body: FilesMvRequest): Promise<void>
  // Move file
  moveFile(body: FilesMvRequest): Promise<void>
  // Delete file
  deleteFile(body: FilesRmRequest): Promise<void>
  // Download file
  downloadFile(body: FilesPathRequest): Promise<void>
  // Get list of files and folders for a path
  list(body: FilesPathRequest): Promise<FileContentResponse[]>
}

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const { imployApiClient } = useImployApi()

  const uploadFile = async (file: Blob) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO handle the upload and refresh list of files at path.
      return imployApiClient.addCSFFiles(file)
    } catch (error) {
      return Promise.reject()
    }
  }

  const createFolder = async (body: FilesPathRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO handle the upload and refresh list of files at path.
      return imployApiClient.addCSFDirectory(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const renameFile = async (body: FilesMvRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      return imployApiClient.moveCSFObject(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const moveFile = async (body: FilesMvRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      return imployApiClient.moveCSFObject(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const deleteFile = async (body: FilesRmRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      return imployApiClient.removeCSFObjects(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const downloadFile = async (body: FilesPathRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO Confirm the return here. Might need to update the API spec.
      return imployApiClient.getFileContent(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const list = async (body: FilesPathRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      // TODO Confirm the return here. Might need to update the API spec.
      return imployApiClient.getCSFChildList(body)
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
    throw new Error("useDrive must be used within a DriveProvider")
  }
  return context
}

export { DriveProvider, useDrive }
