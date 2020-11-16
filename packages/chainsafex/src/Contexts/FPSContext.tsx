import {
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  FilesRmRequest,
} from "@imploy/api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
import { useImployApi } from "@imploy/common-contexts"
import dayjs from "dayjs"
import { v4 as uuidv4 } from "uuid"
import { useToaster } from "@imploy/common-components"
import { uploadsInProgressReducer } from "./FPSReducer"
import { guessContentType } from "../Utils/contentTypeGuesser"
import { CancelToken } from "axios"

type FPSContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type UploadProgress = {
  id: string
  fileName: string
  progress: number
  error: boolean
  complete: boolean
  noOfFiles: number
  path: string
}

type FPSContext = {
  uploadFiles(files: File[], path: string): void
  createFolder(body: FilesPathRequest): Promise<FileContentResponse>
  renameFile(body: FilesMvRequest): Promise<void>
  moveFile(body: FilesMvRequest): Promise<void>
  deleteFile(body: FilesRmRequest): Promise<void>
  downloadFile(fileName: string, cid: string): Promise<void>
  list(body: FilesPathRequest): Promise<FileContentResponse[]>
  currentPath: string
  updateCurrentPath(newPath: string): void
  pathContents: IFile[]
  uploadsInProgress: UploadProgress[]
  spaceUsed: number
}

interface IFile extends FileContentResponse {
  date_uploaded: number // This can be removed when date is added to the schema
}

const REMOVE_UPLOAD_PROGRESS_DELAY = 5000

const FPSContext = React.createContext<FPSContext | undefined>(undefined)

const FPSProvider = ({ children }: FPSContextProps) => {
  const { imployApiClient, isLoggedIn } = useImployApi()
  const { addToastMessage } = useToaster()
  const refreshContents = useCallback(
    async (path: string) => {
      try {
        const newContents = await imployApiClient?.getFPSChildList({
          path,
        })
        if (newContents) {
          // Remove this when the API returns dates
          setPathContents(
            newContents?.map((fcr) => ({
              ...fcr,
              date_uploaded: dayjs().subtract(2, "hour").unix() * 1000,
              content_type:
                fcr.content_type !== "application/octet-stream"
                  ? fcr.content_type
                  : guessContentType(fcr.name),
            })),
          )
        }
      } catch (error) {}
    },
    [imployApiClient],
  )

  const currentPathReducer = (
    currentPath: string,
    action:
      | { type: "add"; payload: string }
      | { type: "refreshOnSamePath"; payload: string },
  ): string => {
    switch (action.type) {
      case "add": {
        return action.payload
      }
      case "refreshOnSamePath": {
        // check user has not navigated to other folder
        // using then catch as awaits won't working in reducer
        if (action.payload === currentPath) {
          refreshContents(currentPath)
        }
        return currentPath
      }
      default:
        return currentPath
    }
  }
  const [currentPath, dispatchCurrentPath] = useReducer(currentPathReducer, "/")

  const [pathContents, setPathContents] = useState<IFile[]>([])
  const [spaceUsed, setSpaceUsed] = useState(0)

  const setCurrentPath = (newPath: string) =>
    dispatchCurrentPath({ type: "add", payload: newPath })

  useEffect(() => {
    if (isLoggedIn) {
      refreshContents(currentPath)
    }
  }, [imployApiClient, refreshContents, currentPath, isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      const getSpaceUsage = async () => {
        try {
          const { csf_size } = await imployApiClient.getFPSFilesStoreInfo()
          setSpaceUsed(csf_size)
        } catch (error) {}
      }
      getSpaceUsage()
    }
  }, [imployApiClient, pathContents, isLoggedIn])

  const [uploadsInProgress, dispatchUploadsInProgress] = useReducer(
    uploadsInProgressReducer,
    [],
  )

  const uploadFiles = async (files: File[], path: string) => {
    const startUploadFile = async () => {
      const id = uuidv4()
      const uploadProgress: UploadProgress = {
        id,
        fileName: files[0].name, // TODO: Do we need this?
        complete: false,
        error: false,
        noOfFiles: files.length,
        progress: 0,
        path,
      }
      dispatchUploadsInProgress({ type: "add", payload: uploadProgress })
      try {
        const filesParam = files.map((f) => ({
          data: f,
          fileName: f.name,
        }))
        // API call
        const result = await imployApiClient.addFPSFiles(
          filesParam,
          path,
          10000,
          1,
          undefined, // TODO: Confirm cancel token not used/provided
          (progressEvent: { loaded: number; total: number }) => {
            dispatchUploadsInProgress({
              type: "progress",
              payload: {
                id,
                progress: Math.ceil(
                  (progressEvent.loaded / progressEvent.total) * 100,
                ),
              },
            })
          },
        )

        // refresh contents
        // using reducer because user may navigate to other paths
        // need to check currentPath and upload path is same
        dispatchCurrentPath({ type: "refreshOnSamePath", payload: path })

        // setting complete
        dispatchUploadsInProgress({ type: "complete", payload: { id } })
        setTimeout(() => {
          dispatchUploadsInProgress({ type: "remove", payload: { id } })
        }, REMOVE_UPLOAD_PROGRESS_DELAY)

        return result
      } catch (error) {
        // setting error
        console.error(error)
        dispatchUploadsInProgress({ type: "error", payload: { id } })
        setTimeout(() => {
          dispatchUploadsInProgress({ type: "remove", payload: { id } })
        }, REMOVE_UPLOAD_PROGRESS_DELAY)
      }
    }
    startUploadFile()
  }

  const createFolder = async (body: FilesPathRequest) => {
    try {
      const result = await imployApiClient.addFPSDirectory(body)
      await refreshContents(currentPath)
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
      await imployApiClient.moveFPSObject(body)
      await refreshContents(currentPath)
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
      await imployApiClient.moveFPSObject(body)
      await refreshContents(currentPath)
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
      await imployApiClient.removeFPSObjects(body)
      await refreshContents(currentPath)
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

  const downloadFile = async (fileName: string, cid: string) => {
    addToastMessage({
      message: "Preparing your download",
      appearance: "info",
    })
    try {
      // TODO: Create a progress bar toast to show file download progress
      const link = document.createElement("a")
      link.href = `${process.env.DOWNLOAD_ENDPOINT}${cid}`
      link.download = fileName
      link.click()
      addToastMessage({
        message: "Download is ready",
        appearance: "info",
      })
      // URL.revokeObjectURL(link.href)
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
      return imployApiClient.getFPSChildList(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  return (
    <FPSContext.Provider
      value={{
        uploadFiles,
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
        spaceUsed,
      }}
    >
      {children}
    </FPSContext.Provider>
  )
}

const useFPS = () => {
  const context = React.useContext(FPSContext)
  if (context === undefined) {
    throw new Error("useFPS must be used within a FPSProvider")
  }
  return context
}

export { FPSProvider, useFPS }
export type { IFile }
