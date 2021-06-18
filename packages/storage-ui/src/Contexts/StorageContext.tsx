import {
  FileContentResponse,
  DirectoryContentResponse,
  BucketType,
  SearchEntry,
  Bucket,
  PinStatus
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

type StorageContext = {
  pins: PinStatus[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  spaceUsed: number
  uploadFiles: (bucketId: string, files: File[], path: string) => Promise<void>
  addPin: (cid: string) => Promise<PinStatus>
  refreshPins: () => void
  unpin: (requestId: string) => void
  storageBuckets: Bucket[]
  createBucket: (name: string) => void
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
  const [spaceUsed, setSpaceUsed] = useState(0)
  const [storageBuckets, setStorageBuckets] = useState<Bucket[]>([])
  const [pins, setPins] = useState<PinStatus[]>([])

  const refreshPins = useCallback(() => {
    storageApiClient.listPins(undefined, undefined, ["queued", "pinning", "pinned"])
      .then((pins) =>  setPins(pins.results || []))
      .catch(console.error)
  }, [storageApiClient])

  const refreshBuckets = useCallback(() => {
    storageApiClient.listBuckets()
      .then((buckets) => setStorageBuckets(buckets.filter(b => b.type === "fps" || b.type === "pinning")))
      .catch(console.error)
  }, [storageApiClient])

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
    const getSpaceUsage = async () => {
      try {
        const totalSize = storageBuckets.reduce((totalSize, bucket) => { return totalSize += (bucket as any).size}, 0)

        setSpaceUsed(totalSize)
      } catch (error) {
        console.error(error)
      }
    }
    if (isLoggedIn) {
      getSpaceUsage()
    }
  }, [isLoggedIn, storageBuckets])


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

  const [downloadsInProgress] = useReducer(
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

  const createBucket = useCallback((name: string) => {
    storageApiClient.createBucket({
      name,
      type: "fps",
      public: "read",
      encryption_key:""
    }).then(() =>
      refreshBuckets()
    ).catch(console.error)
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
      }, REMOVE_UPLOAD_PROGRESS_DELAY)
    }
  }, [storageBuckets, storageApiClient])



  return (
    <StorageContext.Provider
      value={{
        addPin,
        uploadsInProgress,
        spaceUsed,
        downloadsInProgress,
        pins,
        refreshPins,
        unpin,
        storageBuckets,
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
