import {
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  FilesRmRequest,
  FilesUploadResponse,
} from "@imploy/api-client"
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { useImployApi } from "../ImployApiContext"
import dayjs from "dayjs"
import { v4 as uuidv4 } from "uuid"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type UploadProgress = {
  id: string
  fileName: string
  progress: number
  error: boolean
  complete: boolean
  noOfFiles: number
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
  uploadsInProgress: UploadProgress[]
}

interface IFile extends FileContentResponse {
  date_uploaded: number // This can be removed when date is added to the schema
}

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const { imployApiClient } = useImployApi()
  const [currentPath, setCurrentPath] = useState<string>("/")
  const [pathContents, setPathContents] = useState<IFile[]>([])
  const [uploadsInProgress, setUploadsInProgress] = useState<UploadProgress[]>(
    [],
  )

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
    const id = uuidv4()
    try {
      const fileParam = {
        data: file,
        fileName: file.name,
      }

      const uploadProgress: UploadProgress = {
        id,
        fileName: file.name,
        complete: false,
        error: false,
        noOfFiles: 1,
        progress: 0,
      }

      // setting uploads progress
      const onUploadProgress = (id: string, progress: number) => {
        const uploadProgressIndex = uploadsInProgress.findIndex(
          (uploadProgress) => uploadProgress.id === id,
        )
        if (uploadProgressIndex > -1) {
          uploadsInProgress[uploadProgressIndex].progress = progress
          setUploadsInProgress([...uploadsInProgress])
        }
      }

      // adding new upload progress
      setUploadsInProgress([...uploadsInProgress, uploadProgress])

      // API call
      const result = await imployApiClient.addCSFFiles(
        fileParam,
        path,
        undefined,
        (progressEvent: { loaded: number }) => {
          onUploadProgress(id, progressEvent.loaded)
        },
      )
      await refreshContents()

      // setting complete
      const uploadProgressIndex = uploadsInProgress.findIndex(
        (uploadProgress) => uploadProgress.id === id,
      )
      if (uploadProgressIndex > -1) {
        uploadsInProgress[uploadProgressIndex].progress = 100
        uploadsInProgress[uploadProgressIndex].complete = true
        setUploadsInProgress([...uploadsInProgress])
      }

      return result
    } catch (error) {
      // set uploadProgress as Error
      // setting complete
      const uploadProgressIndex = uploadsInProgress.findIndex(
        (uploadProgress) => uploadProgress.id === id,
      )
      if (uploadProgressIndex > -1) {
        uploadsInProgress[uploadProgressIndex].error = true
        setUploadsInProgress([...uploadsInProgress])
      }
      return Promise.reject(error)
    }
  }

  const createFolder = async (body: FilesPathRequest) => {
    try {
      const result = await imployApiClient.addCSFDirectory(body)
      await refreshContents()
      return result
    } catch (error) {
      return Promise.reject()
    }
  }

  const renameFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const moveFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const deleteFile = async (body: FilesRmRequest) => {
    try {
      await imployApiClient.removeCSFObjects(body)
      await refreshContents()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const downloadFile = async (fileName: string) => {
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
      return Promise.resolve()
    } catch (error) {
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
        uploadsInProgress,
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
