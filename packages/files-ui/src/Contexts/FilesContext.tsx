import {
  CSFFilesFullInfoResponse,
  FileContentResponse,
  DirectoryContentResponse,
  BucketType,
  Bucket as FilesBucket,
  SearchEntry
} from "@chainsafe/files-api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
import { decryptFile, encryptFile, useFilesApi, useUser } from "@chainsafe/common-contexts"
import { v4 as uuidv4 } from "uuid"
import { useToaster } from "@chainsafe/common-components"
import { downloadsInProgressReducer, uploadsInProgressReducer } from "./FilesReducers"
import { CancelToken } from "axios"
import { t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import { useBeforeunload } from "react-beforeunload"
import { useThresholdKey } from "./ThresholdKeyContext"

type FilesContextProps = {
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

type BucketPermission = "writer" | "owner" | "reader"

type Bucket = FilesBucket & {
  encryptionKey: string
  permission?: BucketPermission
}

type FilesContext = {
  buckets: Bucket[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  spaceUsed: number
  uploadFiles: (bucketId: string, files: File[], path: string) => Promise<void>
  downloadFile: (bucketId: string, itemToDownload: FileSystemItem, path: string) => void
  getFileContent: (bucketId: string, params: GetFileContentParams) => Promise<Blob | undefined>
  refreshBuckets: () => Promise<void>
  secureAccountWithMasterPassword: (candidatePassword: string) => Promise<void>
}

// This represents a File or Folder on the
interface IFileSystemItem extends FileContentResponse {
  isFolder: boolean
}

type FileSystemItem = IFileSystemItem

const REMOVE_UPLOAD_PROGRESS_DELAY = 5000
const MAX_FILE_SIZE = 2 * 1024 ** 3

const FilesContext = React.createContext<FilesContext | undefined>(undefined)

const FilesProvider = ({ children }: FilesContextProps) => {
  const {
    filesApiClient,
    isLoggedIn,
    secured,
    secureThresholdKeyAccount,
    encryptedEncryptionKey,
    isMasterPasswordSet,
    validateMasterPassword
  } = useFilesApi()
  const { publicKey, encryptForPublicKey, decryptMessageWithThresholdKey } = useThresholdKey()
  const { addToastMessage } = useToaster()
  const [spaceUsed, setSpaceUsed] = useState(0)
  const [personalEncryptionKey, setPersonalEncryptionKey] = useState<string | undefined>()
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const { profile } = useUser()
  const { userId } = profile || {}

  const getKeyForBucket = useCallback(async (bucket: FilesBucket) => {
    const bucketUsers = [...bucket.readers, ...bucket.writers, ...bucket.owners]
    const bucketUser = bucketUsers.find(bu => bu.uuid === userId)
    if (!bucketUser || !bucketUser.encryption_key) {
      console.error(`Unable to retrieve encryption key for ${bucket.id}`)
      return ""
    }
    const decrypted = await decryptMessageWithThresholdKey(bucketUser.encryption_key)
    return decrypted || ""
  }, [decryptMessageWithThresholdKey, userId])

  const refreshBuckets = useCallback(async () => {
    if (!personalEncryptionKey) return
    const result = await filesApiClient.listBuckets()

    const bucketsWithKeys: Bucket[] = await Promise.all(
      result.map(async (b) => {

        const permission = b.owners.find(owner => owner === profile?.userId)
          ? "owner" as BucketPermission
          : b.writers.find(writer => writer === profile?.userId)
            ? "writer" as BucketPermission
            : b.readers.find(reader => reader === profile?.userId)
              ? "reader" as BucketPermission
              : undefined

        return {
          ...b,
          encryptionKey: (b.type === "csf" || b.type === "trash") ? personalEncryptionKey : await getKeyForBucket(b),
          permission
        }}))
    setBuckets(bucketsWithKeys)
    return Promise.resolve()
  }, [personalEncryptionKey, filesApiClient, getKeyForBucket, profile?.userId])

  useEffect(() => {
    refreshBuckets()
  }, [refreshBuckets])

  // Space used counter
  useEffect(() => {
    const getSpaceUsage = async () => {
      try {
        // TODO: Update this to include Share buckets where the current user is the owner
        const totalSize = buckets.filter(b => b.type === "csf" || b.type === "trash")
          .reduce((totalSize, bucket) => { return totalSize += (bucket as any).size}, 0)

        setSpaceUsed(totalSize)
      } catch (error) {
        console.error(error)
      }
    }
    if (isLoggedIn) {
      getSpaceUsage()
    }
  }, [filesApiClient, isLoggedIn, buckets])

  // Reset encryption keys on log out
  useEffect(() => {
    if (!isLoggedIn) {
      setPersonalEncryptionKey(undefined)
      setBuckets([])
    }
  }, [isLoggedIn])

  // Drive encryption handler
  useEffect(() => {
    const secureAccount = async () => {
      if (!publicKey) return
      const key = Buffer.from(
        window.crypto.getRandomValues(new Uint8Array(32))
      ).toString("base64")
      console.log("New key", key)
      setPersonalEncryptionKey(key)
      const encryptedKey = await encryptForPublicKey(publicKey, key)
      console.log("Encrypted encryption key", encryptedKey)
      secureThresholdKeyAccount(encryptedKey)
    }

    const decryptKey = async (encryptedKey: string) => {
      console.log("Decrypting retrieved key")
      try {
        const decryptedKey = await decryptMessageWithThresholdKey(encryptedKey)
        if (decryptedKey) {
          console.log("Decrypted key: ", decryptedKey)
          setPersonalEncryptionKey(decryptedKey)
        }
      } catch (error) {
        console.error("Error decrypting key: ", encryptedKey)
      }
    }

    if (isLoggedIn && publicKey && !personalEncryptionKey) {
      console.log("Checking whether account is secured ", secured)
      if (!secured && !isMasterPasswordSet) {
        console.log("Generating key and securing account")
        secureAccount()
      } else {
        console.log("decrypting key")
        if (encryptedEncryptionKey) {
          decryptKey(encryptedEncryptionKey)
        }
      }
    }
  }, [
    secured,
    isLoggedIn,
    encryptedEncryptionKey,
    publicKey,
    encryptForPublicKey,
    secureThresholdKeyAccount,
    decryptMessageWithThresholdKey,
    personalEncryptionKey,
    isMasterPasswordSet
  ])

  const secureAccountWithMasterPassword = async (candidatePassword: string) => {
    if (!publicKey || !validateMasterPassword(candidatePassword)) return

    const encryptedKey = await encryptForPublicKey(publicKey, candidatePassword)
    setPersonalEncryptionKey(candidatePassword)
    secureThresholdKeyAccount(encryptedKey)
  }

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

  const uploadFiles = useCallback(async (bucketId: string, files: File[], path: string) => {
    const bucket = buckets.find(b => b.id === bucketId)

    if (!bucket || !bucket.encryptionKey) {
      console.error("No encryption key for this bucket is available.")
      return
    }

    const id = uuidv4()
    const uploadProgress: UploadProgress = {
      id,
      fileName: files[0].name, // TODO: Do we need this?
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
          .filter((f) => f.size <= MAX_FILE_SIZE)
          .map(async (f) => {
            const fileData = await readFileAsync(f)
            const encryptedData = await encryptFile(fileData, bucket.encryptionKey)
            return {
              data: new Blob([encryptedData], { type: f.type }),
              fileName: f.name
            }
          })
      )
      if (filesParam.length !== files.length) {
        addToastMessage({
          message:
              "We can't encrypt files larger than 2GB. Some items will not be uploaded",
          appearance: "error"
        })
      }

      // TODO: Update this once API support for FPS is working
      await filesApiClient.addCSFFiles(
        // bucketId,
        filesParam,
        path,
        "csf",
        undefined,
        undefined,
        // undefined,
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
  }, [addToastMessage, filesApiClient, buckets])



  const getFileContent = useCallback(async (
    bucketId: string,
    { cid, cancelToken, onDownloadProgress, file, path }: GetFileContentParams
  ) => {
    const bucket = buckets.find(b => b.id === bucketId)

    if (!bucket || !bucket.encryptionKey) {
      throw new Error("No encryption key for this bucket found")
    }

    // when a file is accessed from the search page, a file  and a path are passed in
    // because the current path will not reflect the right state of the app 
    const fileToGet = file

    if (!fileToGet) {
      console.error("No file passed, and no file found for cid:", cid, "in pathContents:", path)
      throw new Error("No file found.")
    }

    try {
      const result = await filesApiClient.getFileContent(
        {
          path: path,
          source: {
            id: bucket.id
          }
        },
        cancelToken,
        onDownloadProgress
      )

      if (fileToGet.version === 0) {
        return result.data
      } else {
        const decrypted = await decryptFile(
          await result.data.arrayBuffer(),
          bucket.encryptionKey
        )
        if (decrypted) {
          return new Blob([decrypted], {
            type: fileToGet.content_type
          })
        }
      }
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }, [buckets, filesApiClient])

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
        path: `${path}/${itemToDownload.name}`,
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
    <FilesContext.Provider
      value={{
        uploadFiles,
        downloadFile,
        getFileContent,
        uploadsInProgress,
        spaceUsed,
        downloadsInProgress,
        secureAccountWithMasterPassword,
        buckets,
        refreshBuckets

      }}
    >
      {children}
    </FilesContext.Provider>
  )
}

const useFiles = () => {
  const context = React.useContext(FilesContext)
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider")
  }
  return context
}

export { FilesProvider, useFiles }
export type {
  FileSystemItem,
  DirectoryContentResponse,
  CSFFilesFullInfoResponse as FileFullInfo,
  BucketType,
  SearchEntry
}
