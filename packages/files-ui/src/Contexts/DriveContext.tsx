import {
  CSFFilesFullinfoResponse,
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  DirectoryContentResponse,
} from "@imploy/api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
import { decryptFile, encryptFile, useImployApi } from "@imploy/common-contexts"
import { v4 as uuidv4 } from "uuid"
import { useToaster } from "@chainsafe/common-components"
import {
  downloadsInProgressReducer,
  uploadsInProgressReducer,
} from "./DriveReducer"
import { guessContentType } from "../Utils/contentTypeGuesser"
import { CancelToken } from "axios"
import { t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import { useBeforeunload } from "react-beforeunload"

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
  downloadFile(cid: string): Promise<void>
  getFileContent(
    cid: string,
    cancelToken?: CancelToken,
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void,
  ): Promise<Blob | undefined>
  list(body: FilesPathRequest): Promise<FileContentResponse[]>
  currentPath: string
  updateCurrentPath(newPath: string): void
  pathContents: FileSystemItem[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  spaceUsed: number
  isMasterPasswordSet: boolean
  setMasterPassword(password: string): void
  secureDrive(password: string): void
  getFolderTree(): Promise<DirectoryContentResponse>
  getFileInfo(path: string): Promise<CSFFilesFullinfoResponse>
  loadingCurrentPath: boolean
}

// This represents a File or Folder on the
interface IFileSystemItem extends FileContentResponse {
  isFolder: boolean
}

type FileSystemItem = IFileSystemItem

const REMOVE_UPLOAD_PROGRESS_DELAY = 5000
const MAX_FILE_SIZE = 2 * 1024 ** 3

const DriveContext = React.createContext<DriveContext | undefined>(undefined)

const DriveProvider = ({ children }: DriveContextProps) => {
  const {
    imployApiClient,
    isLoggedIn,
    secured,
    secureAccount,
    validateMasterPassword,
  } = useImployApi()
  const { addToastMessage } = useToaster()

  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)

  const refreshContents = useCallback(
    async (path: string, showLoading?: boolean) => {
      try {
        showLoading && setLoadingCurrentPath(true)
        const newContents = await imployApiClient?.getCSFChildList({
          path,
        })
        showLoading && setLoadingCurrentPath(false)

        if (newContents) {
          // Remove this when the API returns dates
          setPathContents(
            newContents?.map((fcr) => ({
              ...fcr,
              content_type:
                fcr.content_type !== "application/octet-stream"
                  ? fcr.content_type
                  : guessContentType(fcr.name),
              isFolder:
                fcr.content_type === "application/chainsafe-files-directory",
            })),
          )
        }
      } catch (error) {
        showLoading && setLoadingCurrentPath(false)
      }
    },
    [imployApiClient],
  )

  const currentPathReducer = (
    currentPath: string,
    action:
      | { type: "update"; payload: string }
      | { type: "refreshOnSamePath"; payload: string },
  ): string => {
    switch (action.type) {
      case "update": {
        return action.payload
      }
      case "refreshOnSamePath": {
        // check user has not navigated to other folder
        // using then catch as awaits won't work in reducer
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

  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const [spaceUsed, setSpaceUsed] = useState(0)
  const [masterPassword, setMasterPassword] = useState<string | undefined>(
    undefined,
  )

  const setCurrentPath = (newPath: string) => {
    dispatchCurrentPath({ type: "update", payload: newPath })
    refreshContents(newPath, true)
  }

  useEffect(() => {
    if (isLoggedIn) {
      refreshContents("/")
    }
  }, [imployApiClient, refreshContents, isLoggedIn])

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

  useEffect(() => {
    if (!isLoggedIn) {
      setMasterPassword(undefined)
    }
  }, [isLoggedIn])

  const [uploadsInProgress, dispatchUploadsInProgress] = useReducer(
    uploadsInProgressReducer,
    [],
  )

  const [downloadsInProgress, dispatchDownloadsInProgress] = useReducer(
    downloadsInProgressReducer,
    [],
  )

  const [closeIntercept, setCloseIntercept] = useState<string | undefined>()

  useEffect(() => {
    if (downloadsInProgress.length > 0) {
      setCloseIntercept("Download in progress, are you sure?")
    } else if (uploadsInProgress.length > 0) {
      setCloseIntercept("Upload in progress, are you sure?")
    } else if (closeIntercept !== undefined) {
      setCloseIntercept(undefined)
    }
  }, [closeIntercept, downloadsInProgress, uploadsInProgress])

  useBeforeunload(() => {
    if (closeIntercept !== undefined) {
      return closeIntercept
    }
  })

  const uploadFiles = async (files: File[], path: string) => {
    const startUploadFile = async () => {
      if (!masterPassword) return // TODO: Add better error handling here.

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
        const filesParam = await Promise.all(
          files
            .filter((f) => f.size <= MAX_FILE_SIZE)
            .map(async (f) => {
              const fileData = await readFileAsync(f)
              const encryptedData = await encryptFile(fileData, masterPassword)
              return {
                data: new Blob([encryptedData], { type: f.type }),
                fileName: f.name,
              }
            }),
        )
        if (filesParam.length !== files.length) {
          addToastMessage({
            message:
              "We can't encrypt files larger than 2GB. Some items will not be uploaded",
            appearance: "error",
          })
        }
        // API call
        const result = await imployApiClient.addCSFFiles(
          filesParam,
          path,
          "",
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

  const getFolderTree = async () => {
    try {
      const result = await imployApiClient.getCSFTree()
      return result
    } catch (error) {
      addToastMessage({
        message: t`There was an error getting folder info`,
        appearance: "error",
      })
      return Promise.reject()
    }
  }

  const getFileInfo = async (path: string) => {
    try {
      const result = await imployApiClient.getCSFFileInfo({ path })
      return result
    } catch (error) {
      addToastMessage({
        message: t`There was an error getting file info`,
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
    cid: string,
    cancelToken?: CancelToken,
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void,
  ) => {
    if (!masterPassword) return // TODO: Add better error handling here.
    const file = pathContents.find((i) => i.cid === cid)
    if (!file) return
    try {
      const result = await imployApiClient.getFileContent(
        {
          path: currentPath + file.name,
        },
        cancelToken,
        onDownloadProgress,
      )

      if (file.version === 0) {
        return result.data
      } else {
        const decrypted = await decryptFile(
          await result.data.arrayBuffer(),
          masterPassword,
        )
        if (decrypted) {
          return new Blob([decrypted], {
            type: file.content_type,
          })
        }
      }
    } catch (error) {
      console.log(error)
      return Promise.reject()
    }
  }

  const downloadFile = async (cid: string) => {
    const itemToDownload = pathContents.find((i) => i.cid === cid)
    if (!itemToDownload) return
    const toastId = uuidv4()
    try {
      const downloadProgress: DownloadProgress = {
        id: toastId,
        fileName: itemToDownload.name,
        complete: false,
        error: false,
        progress: 0,
      }
      dispatchDownloadsInProgress({ type: "add", payload: downloadProgress })
      const result = await getFileContent(
        itemToDownload.cid,
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
        dispatchDownloadsInProgress({
          type: "remove",
          payload: { id: toastId },
        })
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

  const secureDrive = async (password: string) => {
    if (secured) return

    const result = await secureAccount(password)
    if (result) {
      setMasterPassword(password)
    }
  }

  const setPassword = async (password: string) => {
    if (!masterPassword && (await validateMasterPassword(password))) {
      setMasterPassword(password)
    } else {
      console.log(
        "The password is already set, or an incorrect password was entered.",
      )
      return false
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
        getFileContent,
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
        isMasterPasswordSet: !!masterPassword,
        setMasterPassword: setPassword,
        secureDrive,
        getFolderTree,
        loadingCurrentPath,
        getFileInfo,
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
export type {
  FileSystemItem,
  DirectoryContentResponse,
  CSFFilesFullinfoResponse as FileFullInfo,
}
