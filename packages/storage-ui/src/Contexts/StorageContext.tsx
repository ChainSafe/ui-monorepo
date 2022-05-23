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
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { useBeforeunload } from "react-beforeunload"
import { useStorageApi } from "./StorageApiContext"
import { plural, t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import axios, { CancelToken } from "axios"
import { getPathWithFile } from "../Utils/pathUtils"
import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { ToastParams, useToasts } from "@chainsafe/common-components"
dayjs.extend(isSameOrAfter)

type StorageContextProps = {
  children: React.ReactNode | React.ReactNode[]
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
  storageSummary: BucketSummaryResponse | undefined
  getStorageSummary: () => Promise<void>
  uploadFiles: (bucketId: string, files: File[], path: string) => Promise<void>
  downloadFile: (bucketId: string, itemToDownload: FileSystemItem, path: string) => void
  isNextPinsPage: boolean
  isPreviousPinsPage: boolean
  isLoadingPins: boolean
  pagingLoaders?: { next?: boolean; previous?: boolean }
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
  const [isPreviousPinsPage, setIsPreviousPinsPage] = useState(false)
  const [isNextPinsPage, setIsNextPinsPage] = useState(false)
  const [isLoadingPins, setIsLoadingPins] = useState(true)
  const [pagingLoaders, setPagingLoaders] = useState<{
    next?: boolean
    previous?: boolean
  } | undefined>()
  const { addToast, updateToast } = useToasts()

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
      pinsParams.searchedName,
      "partial",
      ["queued", "pinning", "pinned", "failed"],
      pinsParams.pinsRange.after,
      pinsParams.pinsRange.before,
      PINS_PAGE_SIZE,
      undefined,
      pinsParams.pinsRange.before ? "dsc" : "asc"
    ).then((pinsResult) => {
      setPins(pinsResult.results || [])
      // are there more pins
      if (
          pinsResult.results?.length &&
          pinsResult.count &&
          pinsResult.results.length < pinsResult.count
      ) {
        pinsParams.pinsRange.before
          ? setIsNextPinsPage(true)
          : setIsPreviousPinsPage(true)
      } else {
        pinsParams.pinsRange.before
          ? setIsNextPinsPage(false)
          : setIsPreviousPinsPage(false)
      }
    }).catch(console.error)
      .finally(() => {
        setIsLoadingPins(false)
        setPagingLoaders(undefined)
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
    const newBeforeDate = pins.reduce((p1, p2) =>
      new Date(p1.created).getTime() < new Date(p2.created).getTime() ? p1 : p2
    ).created
    setPagingLoaders({ next: true })
    setIsPreviousPinsPage(true)
    setPinsParams({
      ...pinsParams,
      pageNumber: pinsParams.pageNumber + 1,
      pinsRange: {
        before: new Date(newBeforeDate)
      }
    })
  }, [pins, pinsParams ])

  const onPreviousPins = useCallback(() => {
    if (!pins.length || pinsParams.pageNumber === 1) return
    setPagingLoaders({ previous: true })
    setIsNextPinsPage(true)
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
      const newAfterDate = pins.reduce((p1, p2) =>
        new Date(p1.created).getTime() > new Date(p2.created).getTime() ? p1 : p2
      ).created
      setPinsParams({
        ...pinsParams,
        pageNumber: pinsParams.pageNumber - 1,
        pinsRange: {
          after: new Date(newAfterDate)
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


  const [uploadsInProgress, setUploadsInProgress] = useState(false)
  const [downloadsInProgress, setDownloadsInProgress] = useState(false)
  const [closeIntercept, setCloseIntercept] = useState<string | undefined>()

  useEffect(() => {
    if (downloadsInProgress) {
      setCloseIntercept("Download in progress, are you sure?")
    } else if (uploadsInProgress) {
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

    const cancelSource = axios.CancelToken.source()
    const cancelToken = cancelSource.token

    const toastParams: ToastParams = {
      title: plural(files.length, {
        one: `Uploading ${files.length} file`,
        other: `Uploading ${files.length} files`
      }) as string,
      type: "success",
      progress: 0,
      onProgressCancel: cancelSource.cancel,
      isClosable: false
    }

    const toastId = addToast(toastParams)
    setUploadsInProgress(true)

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
        cancelToken,
        undefined,
        (progressEvent: { loaded: number; total: number }) => {
          updateToast(toastId, {
            ...toastParams,
            progress: Math.ceil(
              (progressEvent.loaded / progressEvent.total) * 100
            )
          })
        }
      )

      // setting complete
      updateToast(toastId, {
        ...toastParams,
        title: "Upload complete",
        progress: undefined,
        onProgressCancel: undefined,
        isClosable: true,
        testId: "upload-complete"
      }, true)
      setUploadsInProgress(false)
      await getStorageSummary()
      return Promise.resolve()
    } catch (error: any) {
      setUploadsInProgress(false)
      // setting error
      let errorMessage = t`Something went wrong. We couldn't upload your file`
      // uploads cancelled through button
      if (axios.isCancel(error)) {
        errorMessage = t`Uploads cancelled`
      }
      // we will need a method to parse server errors
      if (error?.error?.code === 409) {
        errorMessage = t`A file with the same name already exists`
      }
      updateToast(toastId, {
        ...toastParams,
        title: errorMessage,
        type: "error",
        progress: undefined,
        onProgressCancel: undefined,
        isClosable: true
      }, true)
    }
  }, [storageBuckets, storageApiClient, addToast, updateToast, getStorageSummary])

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
    const cancelSource = axios.CancelToken.source()
    const cancelToken = cancelSource.token

    const toastParams: ToastParams = {
      title: t`Downloading file - ${itemToDownload.name}`,
      type: "success",
      progress: 0,
      isClosable: false,
      onProgressCancel: cancelSource.cancel
    }
    const toastId = addToast(toastParams)
    setDownloadsInProgress(true)

    try {
      const result = await getFileContent(bucketId, {
        cid: itemToDownload.cid,
        file: itemToDownload,
        path: getPathWithFile(path, itemToDownload.name),
        cancelToken,
        onDownloadProgress: (progressEvent) => {
          updateToast(toastId, {
            ...toastParams,
            progress: Math.ceil(
              (progressEvent.loaded / itemToDownload.size) * 100
            )
          })
        }
      })
      if (!result) return
      const link = document.createElement("a")
      link.href = URL.createObjectURL(result)
      link.download = itemToDownload?.name || "file"
      link.click()
      updateToast(toastId, {
        title: t`Download Complete`,
        type: "success",
        progress: undefined,
        onProgressCancel: undefined,
        isClosable: true
      }, true)
      URL.revokeObjectURL(link.href)
      setDownloadsInProgress(false)
      return Promise.resolve()
    } catch (error: any) {
      console.error(error)
      let errorMessage = `${t`An error occurred: `} ${typeof (error) === "string"
        ? error
        : error?.error?.message || ""}`
      if (axios.isCancel(error)) {
        errorMessage = t`Downloads cancelled`
      }
      updateToast(toastId, {
        title: errorMessage,
        type: "error",
        progress: undefined,
        onProgressCancel: undefined,
        isClosable: true
      }, true)
      setDownloadsInProgress(false)
    }
  }, [getFileContent, addToast, updateToast])

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
        storageSummary,
        getStorageSummary,
        pins,
        refreshPins,
        isNextPinsPage,
        isPreviousPinsPage,
        isLoadingPins,
        pagingLoaders,
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
