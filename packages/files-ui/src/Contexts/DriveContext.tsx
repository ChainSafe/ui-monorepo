import {
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
} from "@imploy/api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
import { useImployApi } from "@imploy/common-contexts"
import dayjs from "dayjs"
import { v4 as uuidv4 } from "uuid"
import { useToaster } from "@chainsafe/common-components"
import {
  downloadsInProgressReducer,
  uploadsInProgressReducer,
} from "./DriveReducer"
import { guessContentType } from "../Utils/contentTypeGuesser"
import { CancelToken } from "axios"
import { t } from "@lingui/macro"

type DriveContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type UploadProgress = {
  id: string
  fileName: string
  progress: number
  error: boolean
  errorMessage?: string
  complete: boolean
  noOfFiles: number
  path: string
}

export type DownloadProgress = {
  id: string
  fileName: string
  progress: number
  error: boolean
  errorMessage?: string
  complete: boolean
}

type DriveContext = {
  uploadFiles(files: File[], path: string): void
  createFolder(body: FilesPathRequest): Promise<FileContentResponse>
  renameFile(body: FilesMvRequest): Promise<void>
  moveFile(body: FilesMvRequest): Promise<void>
  deleteFile(cid: string): Promise<void>
  downloadFile(fileName: string): Promise<void>
  getFileContent(
    fileName: string,
    cancelToken?: CancelToken,
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void,
  ): Promise<Blob>
  list(body: FilesPathRequest): Promise<FileContentResponse[]>
  currentPath: string
  updateCurrentPath(newPath: string): void
  pathContents: IItem[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  spaceUsed: number
}

interface IItem extends FileContentResponse {
  date_uploaded: number
  isFolder: boolean // This can be removed when date is added to the schema
}

const REMOVE_UPLOAD_PROGRESS_DELAY = 5000

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const { imployApiClient, isLoggedIn } = useImployApi()
  const { addToastMessage } = useToaster()

  const refreshContents = useCallback(
    async (path: string) => {
      try {
        const newContents = await imployApiClient?.getCSFChildList({
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
              isFolder:
                fcr.content_type === "application/chainsafe-files-directory",
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

  const [pathContents, setPathContents] = useState<IItem[]>([])
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
          const { csf_size } = await imployApiClient.getCSFFilesStoreInfo()
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

  const [downloadsInProgress, dispatchDownloadsInProgress] = useReducer(
    downloadsInProgressReducer,
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

        const result = await imployApiClient.addCSFFiles(
          filesParam,
          path,
          undefined,
          undefined,
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
        let errorMessage = t`Something went wrong. We couldn't upload your file`

        // we will need a method to parse server errors
        if (Array.isArray(error) && error[0].message.includes("conflict")) {
          errorMessage = t`A file with the same name already exists`
        }
        dispatchUploadsInProgress({
          type: "error",
          payload: { id, errorMessage },
        })
        setTimeout(() => {
          dispatchUploadsInProgress({ type: "remove", payload: { id } })
        }, REMOVE_UPLOAD_PROGRESS_DELAY)
      }
    }
    startUploadFile()
  }

  const createFolder = async (body: FilesPathRequest) => {
    try {
      const result = await imployApiClient.addCSFDirectory(body)
      await refreshContents(currentPath)
      addToastMessage({
        message: t`Folder created successfully`,
        appearance: "success",
      })
      return result
    } catch (error) {
      addToastMessage({
        message: t`There was an error creating this folder`,
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const renameFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents(currentPath)
      addToastMessage({
        message: t`File renamed successfully`,
        appearance: "success",
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: t`There was an error renaming this file`,
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const moveFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents(currentPath)
      addToastMessage({
        message: t`File moved successfully`,
        appearance: "success",
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: t`There was an error moving this file`,
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const deleteFile = async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)
    if (!itemToDelete) return
    try {
      await imployApiClient.removeCSFObjects({
        paths: [`${currentPath}${itemToDelete.name}`],
      })
      await refreshContents(currentPath)
      const message = `${
        itemToDelete.isFolder ? t`Folder` : t`File`
      } ${t`deleted successfully`}`
      addToastMessage({
        message: message,
        appearance: "success",
      })
      return Promise.resolve()
    } catch (error) {
      const message = `${t`There was an error deleting this`} ${
        itemToDelete.isFolder ? t`folder` : t`file`
      }`
      addToastMessage({
        message: message,
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const getFileContent = async (
    fileName: string,
    cancelToken?: CancelToken,
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void,
  ) => {
    try {
      const result = await imployApiClient.getFileContent(
        {
          path: currentPath + fileName,
        },
        cancelToken,
        onDownloadProgress,
      )
      return result.data
    } catch (error) {
      return Promise.reject()
    }
  }

  const downloadFile = async (cid: string) => {
    const itemToDownload = pathContents.find((i) => i.cid === cid)
    if (!itemToDownload) return
    const toastId = uuidv4()
    try {
      // TODO: Create a progress bar toast to show file download progress
      const downloadProgress: DownloadProgress = {
        id: toastId,
        fileName: itemToDownload.name, // TODO: Do we need this?
        complete: false,
        error: false,
        progress: 0,
      }
      dispatchDownloadsInProgress({ type: "add", payload: downloadProgress })
      const result = await getFileContent(
        itemToDownload?.name || "",
        undefined,
        (progressEvent) => {
          dispatchDownloadsInProgress({
            type: "progress",
            payload: {
              id: toastId,
              progress: Math.ceil(
                (progressEvent.loaded / itemToDownload.size) * 100,
              ),
            },
          })
        },
      )
      if (!result) return
      const link = document.createElement("a")
      link.href = URL.createObjectURL(result)
      link.download = itemToDownload?.name || "file"
      link.click()
      dispatchDownloadsInProgress({
        type: "complete",
        payload: { id: toastId },
      })
      URL.revokeObjectURL(link.href)
      setTimeout(() => {
        dispatchUploadsInProgress({ type: "remove", payload: { id: toastId } })
      }, REMOVE_UPLOAD_PROGRESS_DELAY)
      return Promise.resolve()
    } catch (error) {
      dispatchDownloadsInProgress({ type: "error", payload: { id: toastId } })
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
        uploadFiles,
        createFolder,
        renameFile,
        moveFile,
        deleteFile,
        downloadFile,
        getFileContent: getFileContent,
        list,
        currentPath,
        updateCurrentPath: (newPath: string) =>
          newPath.endsWith("/")
            ? setCurrentPath(`${newPath}`)
            : setCurrentPath(`${newPath}/`),
        pathContents,
        uploadsInProgress,
        spaceUsed,
        downloadsInProgress,
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
export type { IItem as IFile }
