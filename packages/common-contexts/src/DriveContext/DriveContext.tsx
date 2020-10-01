import {
  FileContentResponse,
  FileParameter,
  FilesMvRequest,
  FilesPathRequest,
  FilesRmRequest,
  FilesUploadResponse,
} from "@imploy/api-client"
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { useImployApi } from "../ImployApiContext"
import dayjs from "dayjs"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type DriveContext = {
  // Upload file
  uploadFile(file: FileParameter): Promise<FilesUploadResponse>
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
  currentPath: string
  updateCurrentPath(newPath: string): void
  pathContents: IFile[]
}

interface IFile extends FileContentResponse {
  date_uploaded: number // This can be removed when date is added to the schema
}

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const { imployApiClient } = useImployApi()
  const [currentPath, setCurrentPath] = useState<string>("/")
  const [pathContents, setPathContents] = useState<IFile[]>([])

  const refreshContents = useCallback(async () => {
    try {
      const newContents = await imployApiClient?.getCSFChildList({
        path: currentPath,
      })
      if (newContents) {
        // Remove this when the API returns dates
        setPathContents(
          newContents?.map((fcr) => ({
            ...fcr,
            date_uploaded: dayjs().subtract(2, "hour").unix() * 1000,
          })),
        )
      }
    } catch (error) {}
  }, [imployApiClient])

  useEffect(() => {
    refreshContents()
  }, [imployApiClient, refreshContents])

  const uploadFile = async (file: FileParameter) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      const result = await imployApiClient.addCSFFiles(file, currentPath)
      await refreshContents()
      return result
    } catch (error) {
      return Promise.reject()
    }
  }

  const createFolder = async (body: FilesPathRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      const result = await imployApiClient.addCSFDirectory(body)
      await refreshContents()
      return result
    } catch (error) {
      return Promise.reject()
    }
  }

  const renameFile = async (body: FilesMvRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const moveFile = async (body: FilesMvRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const deleteFile = async (body: FilesRmRequest) => {
    if (!imployApiClient) return Promise.reject("Api Client is not initialized")

    try {
      await imployApiClient.removeCSFObjects(body)
      await refreshContents()
      return Promise.resolve()
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
        currentPath,
        updateCurrentPath: setCurrentPath,
        pathContents,
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

export { DriveProvider, useDrive, IFile }
