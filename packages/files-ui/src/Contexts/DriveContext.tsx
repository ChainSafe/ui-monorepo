import {
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  FilesRmRequest,
  FilesUploadResponse,
} from "@imploy/api-client"
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { useImployApi } from "@imploy/common-contexts"
import dayjs from "dayjs"
import { useToaster } from "@imploy/common-components"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

type DriveContext = {
  // Upload file
  uploadFile(file: File, path: string): Promise<FilesUploadResponse>
  // Create folder
  createFolder(body: FilesPathRequest): Promise<FileContentResponse>
  // Rename file
  renameFile(body: FilesMvRequest): Promise<void>
  // Move file
  moveFile(body: FilesMvRequest): Promise<void>
  // Delete file
  deleteFile(body: FilesRmRequest): Promise<void>
  // Download file
  downloadFile(fileName: string): Promise<void>
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
  const { addToastMessage } = useToaster()

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
  }, [imployApiClient, currentPath])

  useEffect(() => {
    refreshContents()
  }, [imployApiClient, refreshContents, currentPath])

  const uploadFile = async (file: File, path: string) => {
    try {
      addToastMessage({
        message: "Uploading file",
        appearance: "info",
      })
      const fileParam = {
        data: file,
        fileName: file.name,
      }

      const result = await imployApiClient.addCSFFiles(fileParam, path)
      await refreshContents()
      addToastMessage({
        message: "File upload successful",
        appearance: "success",
      })
      return result
    } catch (error) {
      addToastMessage({
        message: "There was an error uploading this file",
        appearance: "error",
      })
      return Promise.reject(error)
    }
  }

  const createFolder = async (body: FilesPathRequest) => {
    try {
      const result = await imployApiClient.addCSFDirectory(body)
      await refreshContents()
      addToastMessage({
        message: "Folder created successfully",
        appearance: "success",
      })
      return result
    } catch (error) {
      addToastMessage({
        message: "There was an error creating this folder",
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const renameFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents()
      addToastMessage({
        message: "File renamed successfully",
        appearance: "success",
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: "There was an error renaming this file",
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const moveFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents()
      addToastMessage({
        message: "File moved successfully",
        appearance: "success",
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: "There was an error moving this file",
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const deleteFile = async (body: FilesRmRequest) => {
    try {
      await imployApiClient.removeCSFObjects(body)
      await refreshContents()
      addToastMessage({
        message: "File deleted successfully",
        appearance: "success",
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: "There was an error deleting this file",
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const downloadFile = async (fileName: string) => {
    addToastMessage({
      message: "Preparing your download",
      appearance: "info",
    })
    try {
      //TODO: Fix the response of this method
      const result = await imployApiClient.getFileContent({
        path: currentPath + fileName,
      })

      //@ts-ignore
      const blob = new Blob([result])
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      addToastMessage({
        message: "Download is ready",
        appearance: "info",
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: "There was an error downloading this file",
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const list = async (body: FilesPathRequest) => {
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
        updateCurrentPath: (newPath: string) =>
          newPath.endsWith("/")
            ? setCurrentPath(`${newPath}`)
            : setCurrentPath(`${newPath}/`),
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

export { DriveProvider, useDrive }
export type { IFile }
