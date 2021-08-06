import {
  FileContentResponse,
  DirectoryContentResponse,
  BucketType,
  SearchEntry,
  Bucket,
  PinStatus,
  BucketSummaryResponse
} from "@chainsafe/files-api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
// import { v4 as uuidv4 } from "uuid"
import { downloadsInProgressReducer, uploadsInProgressReducer } from "./FileOperationsReducers"
// import { t } from "@lingui/macro"
import { useBeforeunload } from "react-beforeunload"
import { useStorageApi } from "./StorageApiContext"
import { v4 as uuidv4 } from "uuid"
import { t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import axios, { CancelToken } from "axios"
import { getPathWithFile } from "../Utils/pathUtils"

type StorageContextProps = {
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

interface GetFileContentParams {
  cid: string
  cancelToken?: CancelToken
  onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void
  file: FileSystemItem
  path: string
}

type StorageContext = {
  pins: PinStatus[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  storageSummary: BucketSummaryResponse | undefined
  getStorageSummary: () => Promise<void>
  uploadFiles: (bucketId: string, files: File[], path: string) => Promise<void>
  downloadFile: (bucketId: string, itemToDownload: FileSystemItem, path: string) => void
  addPin: (cid: string) => Promise<PinStatus>
  refreshPins: () => void
  unpin: (requestId: string) => void
  storageBuckets: Bucket[]
  createBucket: (name: string) => Promise<void>
  removeBucket: (id: string) => void
}

// This represents a File or Folder on the
interface IFileSystemItem extends FileContentResponse {
  isFolder: boolean
}

type FileSystemItem = IFileSystemItem
const REMOVE_UPLOAD_PROGRESS_DELAY = 5000

const StorageContext = React.createContext<StorageContext | undefined>(undefined)

const StorageProvider = ({ children }: StorageContextProps) => {
  const { storageApiClient, isLoggedIn } = useStorageApi()
  const [storageSummary, setBucketSummary] = useState<BucketSummaryResponse | undefined>()
  const [storageBuckets, setStorageBuckets] = useState<Bucket[]>([])
  const [pins, setPins] = useState<PinStatus[]>([])

  const getStorageSummary = useCallback(async () => {
    try {
      const bucketSummaryData = await storageApiClient.bucketsSummary()
      setBucketSummary(bucketSummaryData)
    } catch (error) {
      console.error(error)
    }
  }, [storageApiClient])

  const refreshPins = useCallback(() => {
    storageApiClient.listPins(
      undefined,
      undefined,
      ["queued", "pinning", "pinned", "failed"],
      undefined,
      undefined,
      50
    ).then((pins) =>  setPins(pins.results || []))
      .catch(console.error)
      .finally(() => getStorageSummary())
  }, [storageApiClient, getStorageSummary])

  const refreshBuckets = useCallback(() => {
    storageApiClient.listBuckets()
      .then((buckets) => setStorageBuckets(buckets.filter(b => b.type === "fps")))
      .catch(console.error)
      .finally(() => getStorageSummary())
  }, [storageApiClient, getStorageSummary])

  useEffect(() => {
    isLoggedIn && refreshPins()
    isLoggedIn && refreshBuckets()
  }, [isLoggedIn, refreshPins, refreshBuckets])

  const unpin = useCallback((requestId: string) => {
    storageApiClient.deletePin(requestId)
      .then(() => refreshPins())
      .catch(console.error)
  }, [storageApiClient, refreshPins])

  // Space used counter
  useEffect(() => {
    if (isLoggedIn) {
      getStorageSummary()
    }
  }, [isLoggedIn, getStorageSummary])

  // Reset encryption keys on log out
  useEffect(() => {
    if (!isLoggedIn) {
      setPins([])
    }
  }, [isLoggedIn])

  const [uploadsInProgress, dispatchUploadsInProgress] = useReducer(
    uploadsInProgressReducer,
    []
  )

  const [downloadsInProgress, dispatchDownloadsInProgress] = useReducer(
    downloadsInProgressReducer,
    []
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

  const addPin = useCallback((cid: string) => {
    return storageApiClient.addPin(({ cid }))
  }, [storageApiClient])

  const createBucket = useCallback(async (name: string) => {
    return storageApiClient.createBucket({
      name,
      type: "fps",
      public: "read",
      encryption_key:""
    })
      .then(refreshBuckets)
      .catch(console.error)
  }, [storageApiClient, refreshBuckets])

  const removeBucket = useCallback((id: string) => {
    storageApiClient.removeBucket(id)
      .then(refreshBuckets)
      .then(Promise.resolve)
      .catch(console.error)
  }, [storageApiClient, refreshBuckets])

  const uploadFiles = useCallback(async (bucketId: string, files: File[], path: string) => {
    const bucket = storageBuckets.find(b => b.id === bucketId)

    if (!bucket) {
      console.error("Destination bucket does not exist.")
      return
    }

    const id = uuidv4()
    const uploadProgress: UploadProgress = {
      id,
      fileName: files[0].name,
      complete: false,
      error: false,
      noOfFiles: files.length,
      progress: 0,
      path
    }
    dispatchUploadsInProgress({ type: "add", payload: uploadProgress })

    try {
      const filesParam = await Promise.all(
        files
          .map(async (f) => {
            const fileData = await readFileAsync(f)
            return {
              data: new Blob([fileData], { type: f.type }),
              fileName: f.name
            }
          })
      )

      await storageApiClient.uploadBucketObjects(
        bucketId,
        filesParam,
        path,
        undefined,
        1,
        undefined,
        undefined,
        (progressEvent: { loaded: number; total: number }) => {
          dispatchUploadsInProgress({
            type: "progress",
            payload: {
              id,
              progress: Math.ceil(
                (progressEvent.loaded / progressEvent.total) * 100
              )
            }
          })
        }
      )
      // setting complete
      dispatchUploadsInProgress({ type: "complete", payload: { id } })
      setTimeout(() => {
        getStorageSummary()
        dispatchUploadsInProgress({ type: "remove", payload: { id } })
      }, REMOVE_UPLOAD_PROGRESS_DELAY)

      return Promise.resolve()
    } catch (error) {
      console.error(error)
      // setting error
      let errorMessage = t`Something went wrong. We couldn't upload your file`

      // we will need a method to parse server errors
      if (Array.isArray(error) && error[0].message.includes("conflict")) {
        errorMessage = t`A file with the same name already exists`
      }
      dispatchUploadsInProgress({
        type: "error",
        payload: { id, errorMessage }
      })
      setTimeout(() => {
        dispatchUploadsInProgress({ type: "remove", payload: { id } })
        getStorageSummary()
      }, REMOVE_UPLOAD_PROGRESS_DELAY)
    }
  }, [storageBuckets, storageApiClient, getStorageSummary])

  const getFileContent = useCallback(async (
    bucketId: string,
    { cid, cancelToken, onDownloadProgress, file, path }: GetFileContentParams
  ) => {

    // when a file is accessed from the search page, a file  and a path are passed in
    // because the current path will not reflect the right state of the app 
    const fileToGet = file

    if (!fileToGet) {
      console.error("No file passed, and no file found for cid:", cid, "in pathContents:", path)
      throw new Error("No file found.")
    }

    try {
      const result = await storageApiClient.getBucketObjectContent(
        bucketId,
        { path: path },
        cancelToken,
        onDownloadProgress
      )

      return result.data

    } catch (error) {
      if (axios.isCancel(error)) {
        return Promise.reject()
      } else {
        console.error(error)
        return Promise.reject(error)
      }
    }
  }, [storageApiClient])

  const downloadFile = useCallback(async (bucketId: string, itemToDownload: FileSystemItem, path: string) => {
    const toastId = uuidv4()
    try {
      const downloadProgress: DownloadProgress = {
        id: toastId,
        fileName: itemToDownload.name,
        complete: false,
        error: false,
        progress: 0
      }
      dispatchDownloadsInProgress({ type: "add", payload: downloadProgress })
      const result = await getFileContent(bucketId, {
        cid: itemToDownload.cid,
        file: itemToDownload,
        path: getPathWithFile(path, itemToDownload.name),
        onDownloadProgress: (progressEvent) => {
          dispatchDownloadsInProgress({
            type: "progress",
            payload: {
              id: toastId,
              progress: Math.ceil(
                (progressEvent.loaded / itemToDownload.size) * 100
              )
            }
          })
        }
      })
      if (!result) return
      const link = document.createElement("a")
      link.href = URL.createObjectURL(result)
      link.download = itemToDownload?.name || "file"
      link.click()
      dispatchDownloadsInProgress({
        type: "complete",
        payload: { id: toastId }
      })
      URL.revokeObjectURL(link.href)
      setTimeout(() => {
        dispatchDownloadsInProgress({
          type: "remove",
          payload: { id: toastId }
        })
      }, REMOVE_UPLOAD_PROGRESS_DELAY)
      return Promise.resolve()
    } catch (error) {
      dispatchDownloadsInProgress({ type: "error", payload: { id: toastId } })
      return Promise.reject()
    }
  }, [getFileContent])

  return (
    <StorageContext.Provider
      value={{
        addPin,
        uploadsInProgress,
        storageSummary,
        getStorageSummary,
        downloadsInProgress,
        pins,
        refreshPins,
        unpin,
        storageBuckets,
        downloadFile,
        createBucket,
        removeBucket,
        uploadFiles
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

const useStorage = () => {
  const context = React.useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider")
  }
  return context
}

export { StorageProvider, useStorage }
export type {
  FileSystemItem,
  DirectoryContentResponse,
  BucketType,
  SearchEntry
}
