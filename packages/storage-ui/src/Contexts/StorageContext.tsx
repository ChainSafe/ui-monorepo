import {
  FileContentResponse,
  DirectoryContentResponse,
  BucketType,
  SearchEntry,
  Bucket,
  PinStatus,
  BucketSummaryResponse,
  PinResult,
  FileSystemType
} from "@chainsafe/files-api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
import { downloadsInProgressReducer, uploadsInProgressReducer } from "./FileOperationsReducers"
import { useBeforeunload } from "react-beforeunload"
import { useStorageApi } from "./StorageApiContext"
import { v4 as uuidv4 } from "uuid"
import { t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import axios, { CancelToken } from "axios"
import { getPathWithFile } from "../Utils/pathUtils"
import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
dayjs.extend(isSameOrAfter)

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

const PINS_PAGE_SIZE = 15

interface GetFileContentParams {
  cid: string
  cancelToken?: CancelToken
  onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void
  file: FileSystemItem
  path: string
}

interface RefreshPinParams {
  searchedCid?: string
  searchedName?: string
}

type StorageContext = {
  pins: PinStatus[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  storageSummary: BucketSummaryResponse | undefined
  getStorageSummary: () => Promise<void>
  uploadFiles: (bucketId: string, files: File[], path: string) => Promise<void>
  downloadFile: (bucketId: string, itemToDownload: FileSystemItem, path: string) => void
  isNextPins: boolean
  isPreviousPins: boolean
  isLoadingPins: boolean
  isPagingLoading: boolean
  onNextPins: () => void
  onPreviousPins: () => void
  addPin: (cid: string, name: string) => Promise<PinStatus | undefined>
  refreshPins: (params?: RefreshPinParams) => void
  unpin: (requestId: string) => void
  storageBuckets: Bucket[]
  createBucket: (name: string, fileSystemType: FileSystemType) => Promise<void>
  removeBucket: (id: string) => void
  refreshBuckets: () => void
  searchCid: (cid: string) => Promise<PinResult | void>
  onSearch: (searchParams: RefreshPinParams) => void
  pageNumber: number
  resetPins: () => void
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
  const [pinsParams, setPinsParams] = useState<{
    pageNumber: number
    pinsRange: {
      before?: Date
      after?: Date
    }
    searchedCID?: string
    searchedName?: string
  }>({
    pageNumber: 1,
    pinsRange: {
      before: new Date()
    }
  })
  const [isPreviousPins, setIsPreviousPins] = useState(false)
  const [isNextPins, setIsNextPins] = useState(false)
  const [isLoadingPins, setIsLoadingPins] = useState(true)
  const [isPagingLoading, setIsPagingLoading] = useState(false)

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
      pinsParams.searchedCID ? [pinsParams.searchedCID] : undefined,
      pinsParams.searchedName || undefined,
      "partial",
      ["queued", "pinning", "pinned", "failed"],
      pinsParams.pinsRange.after,
      pinsParams.pinsRange.before,
      PINS_PAGE_SIZE,
      undefined,
      pinsParams.pinsRange.before ? "dsc" : "asc"
    ).then((pinsResult) => {
      setPins(pinsResult.results || [])
      if (pinsParams.pinsRange.before) {
        // next pins
        if (
          pinsResult.results?.length &&
          pinsResult.count &&
          pinsResult.results.length < pinsResult.count
        ) {
          setIsNextPins(true)
        } else {
          setIsNextPins(false)
        }
      } else {
        // previous pins
        if (
          pinsResult.results?.length &&
          pinsResult.count &&
          pinsResult.results.length < pinsResult.count
        ) {
          setIsPreviousPins(true)
        } else {
          setIsPreviousPins(false)
        }
      }
    }).catch(console.error)
      .finally(() => {
        setIsLoadingPins(false)
        setIsPagingLoading(false)
      })
  }, [storageApiClient, pinsParams])

  const resetPins = useCallback(() => {
    setIsLoadingPins(true)
    setPinsParams({
      pageNumber: 1,
      pinsRange: {
        before: new Date()
      },
      searchedCID: undefined,
      searchedName: undefined
    })
  }, [])

  const onNextPins = useCallback(() => {
    if (!pins.length) return
    setIsPagingLoading(true)
    setIsPreviousPins(true)
    setPinsParams({
      ...pinsParams,
      pageNumber: pinsParams.pageNumber + 1,
      pinsRange: {
        before: new Date(pins[pins.length - 1].created)
      }
    })
  }, [pins, pinsParams ])

  const onPreviousPins = useCallback(() => {
    if (!pins.length || pinsParams.pageNumber === 1) return
    setIsPagingLoading(true)
    setIsNextPins(true)
    // moving into page 1 - reset
    if (pinsParams.pageNumber === 2) {
      setPinsParams({
        ...pinsParams,
        pageNumber: 1,
        pinsRange: {
          before: new Date()
        }
      })
    } else {
      setPinsParams({
        ...pinsParams,
        pageNumber: pinsParams.pageNumber - 1,
        pinsRange: {
          after: new Date(pins[0].created)
        }
      })
    }
  }, [pins, pinsParams])

  const onSearch = useCallback((searchParams: RefreshPinParams) => {
    setIsLoadingPins(true)
    setPinsParams({
      pinsRange: {
        before: new Date()
      },
      pageNumber: 1,
      searchedCID: searchParams.searchedCid,
      searchedName: searchParams.searchedName
    })
  }, [])

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
      .then(refreshPins)
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

  const addPin = useCallback(async (cid: string, name: string) => {
    try {
      const pinStatus = await storageApiClient.addPin(({ cid, name }))
      if (pinsParams.pageNumber === 1) {
        setPinsParams({
          ...pinsParams,
          pinsRange: {
            before: new Date(new Date(pinStatus.created).getTime() + 1)
          }
        })
      }
      return pinStatus
    } catch (e) {
      console.error(e)
    }
  }, [storageApiClient, pinsParams])

  const createBucket = useCallback(async (name: string, fileSystemType: FileSystemType) => {
    return storageApiClient.createBucket({
      name,
      type: "fps",
      public: "read",
      encryption_key: "",
      file_system_type: fileSystemType
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
    } catch (error: any) {
      // setting error
      let errorMessage = t`Something went wrong. We couldn't upload your file`

      // we will need a method to parse server errors
      if (error?.error?.code === 409) {
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
    { cancelToken, onDownloadProgress, path }: GetFileContentParams
  ) => {

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

  const searchCid = useCallback((cid: string) => {
    return storageApiClient.listPins(
      [cid],
      undefined,
      undefined,
      ["queued", "pinning", "pinned", "failed"],
      undefined,
      undefined,
      50
    ).catch(console.error)
  }, [storageApiClient])

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
        isNextPins,
        isPreviousPins,
        isLoadingPins,
        isPagingLoading,
        onNextPins,
        onPreviousPins,
        unpin,
        storageBuckets,
        downloadFile,
        createBucket,
        removeBucket,
        uploadFiles,
        refreshBuckets,
        searchCid,
        onSearch,
        pageNumber: pinsParams.pageNumber,
        resetPins
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
