import {
  CSFFilesFullinfoResponse,
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  DirectoryContentResponse,
  BucketType,
  Bucket,
  SearchEntry,
  FilesRmRequest
} from "@chainsafe/files-api-client"
import React, { useCallback, useEffect, useReducer } from "react"
import { useState } from "react"
import { decryptFile, encryptFile, useImployApi } from "@chainsafe/common-contexts"
import { v4 as uuidv4 } from "uuid"
import { useToaster } from "@chainsafe/common-components"
import {
  downloadsInProgressReducer,
  uploadsInProgressReducer
} from "./DriveReducer"
import { CancelToken } from "axios"
import { t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import { useBeforeunload } from "react-beforeunload"
import { useThresholdKey } from "./ThresholdKeyContext"

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

interface GetFileContentParams {
  cid: string
  cancelToken?: CancelToken
  onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void
  file: FileSystemItem
  path: string
  bucketType: BucketType
}


type DriveContext = {
  uploadFiles: (files: File[], path: string) => void
  createFolder: (body: FilesPathRequest) => Promise<FileContentResponse>
  renameFile: (body: FilesMvRequest) => Promise<void>
  moveFile: (body: FilesMvRequest) => Promise<void>
  moveFiles: (filesToMove: FilesMvRequest[]) => Promise<void[]>
  moveCSFObject: (body: FilesMvRequest) => Promise<void>
  removeCSFObjects: (body: FilesRmRequest) => Promise<void>
  downloadFile: (itemToDownload: FileSystemItem, path: string, bucketType: BucketType) => void
  getFileContent: ({ cid, cancelToken, onDownloadProgress, file }: GetFileContentParams) => Promise<Blob | undefined>
  list: (body: FilesPathRequest) => Promise<FileContentResponse[]>
  listBuckets: (bucketType: BucketType) => Promise<Bucket[]>
  searchFiles: (bucketId: string, searchString: string) => Promise<SearchEntry[]>
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  spaceUsed: number
  getFolderTree: () => Promise<DirectoryContentResponse>
  getFileInfo: (path: string)  => Promise<CSFFilesFullinfoResponse>
  secureAccountWithMasterPassword: (candidatePassword: string) => Promise<void>
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
    secureThresholdKeyAccount,
    encryptedEncryptionKey,
    isMasterPasswordSet,
    validateMasterPassword
  } = useImployApi()
  const { publicKey, encryptForPublicKey, decryptMessageWithThresholdKey } = useThresholdKey()
  const { addToastMessage } = useToaster()
  const [spaceUsed, setSpaceUsed] = useState(0)
  const [encryptionKey, setEncryptionKey] = useState<string | undefined>()

  // Space used counter
  useEffect(() => {
    const getSpaceUsage = async () => {
      try {
        const { csf_size } = await imployApiClient.getCSFFilesStoreInfo()
        setSpaceUsed(csf_size)
      } catch (error) {
        console.error(error)
      }
    }
    if (isLoggedIn) {
      getSpaceUsage()
    }
  }, [imployApiClient, isLoggedIn])

  // Reset password on log out
  useEffect(() => {
    if (!isLoggedIn) {
      setEncryptionKey(undefined)
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
      setEncryptionKey(key)
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
          setEncryptionKey(decryptedKey)
        }
      } catch (error) {
        console.error("Error decrypting key: ", encryptedKey)
      }
    }

    if (isLoggedIn && publicKey && !encryptionKey) {
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
    encryptionKey,
    isMasterPasswordSet
  ])

  const secureAccountWithMasterPassword = async (candidatePassword: string) => {
    if (!publicKey || !validateMasterPassword(candidatePassword)) return

    const encryptedKey = await encryptForPublicKey(publicKey, candidatePassword)
    setEncryptionKey(candidatePassword)
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

  const uploadFiles = useCallback(async (files: File[], path: string) => {
    const startUploadFile = async () => {
      if (!encryptionKey) return // TODO: Add better error handling here.

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
              const encryptedData = await encryptFile(fileData, encryptionKey)
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
          payload: { id, errorMessage }
        })
        setTimeout(() => {
          dispatchUploadsInProgress({ type: "remove", payload: { id } })
        }, REMOVE_UPLOAD_PROGRESS_DELAY)
      }
    }
    startUploadFile()
  }, [addToastMessage, encryptionKey, imployApiClient])

  const createFolder = async (body: FilesPathRequest) => {
    try {
      const result = await imployApiClient.addCSFDirectory(body)
      addToastMessage({
        message: t`Folder created successfully`,
        appearance: "success"
      })
      return result
    } catch (error) {
      addToastMessage({
        message: t`There was an error creating this folder`,
        appearance: "error"
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
        appearance: "error"
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
        appearance: "error"
      })
      return Promise.reject()
    }
  }

  const renameFile = useCallback(async (body: FilesMvRequest) => {
    try {
      if (body.path !== body.new_path) {
        await imployApiClient.moveCSFObject(body)
        addToastMessage({
          message: t`File renamed successfully`,
          appearance: "success"
        })
      }

      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: t`There was an error renaming this file`,
        appearance: "error"
      })
      return Promise.reject()
    }
  }, [addToastMessage, imployApiClient])

  const moveFile = useCallback(async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      addToastMessage({
        message: t`File moved successfully`,
        appearance: "success"
      })
      return Promise.resolve()
    } catch (error) {
      addToastMessage({
        message: t`There was an error moving this file`,
        appearance: "error"
      })
      return Promise.reject()
    }
  }, [addToastMessage, imployApiClient])

  const moveFiles = useCallback(async (filesToMove: FilesMvRequest[]) => {
    return Promise.all(
      filesToMove.map((fileToMove) =>
        moveFile(fileToMove)
      )
    )
  }, [moveFile])

  const getFileContent = useCallback(async ({ cid, cancelToken, onDownloadProgress, file, path, bucketType }: GetFileContentParams) => {
    if (!encryptionKey) {
      throw new Error("No encryption key")
    }

    // when a file is accessed from the search page, a file  and a path are passed in
    // because the current path will not reflect the right state of the app 
    const fileToGet = file

    if (!fileToGet) {
      console.error("No file passed, and no file found for cid:", cid, "in pathContents:", path)
      throw new Error("No file found.")
    }

    try {
      const result = await imployApiClient.getFileContent(
        {
          path: path,
          source: {
            type: bucketType
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
          encryptionKey
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
  }, [encryptionKey, imployApiClient])

  const downloadFile = useCallback(async (itemToDownload: FileSystemItem, path: string, bucketType: BucketType) => {
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
      const result = await getFileContent({
        cid: itemToDownload.cid,
        bucketType: bucketType,
        file: itemToDownload,
        path: path,
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

  const list = async (body: FilesPathRequest) => {
    try {
      return imployApiClient.getCSFChildList(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const listBuckets = async (bucketType: BucketType) => {
    return await imployApiClient.listBuckets(bucketType)
  }

  const removeCSFObjects = async (body: FilesRmRequest) => {
    return await imployApiClient.removeCSFObjects(body)
  }

  const moveCSFObject = async (body: FilesMvRequest) => {
    return await imployApiClient.moveCSFObject(body)
  }

  const searchFiles = useCallback(async (bucketId: string, searchString: string) => {
    return  await imployApiClient.searchFiles({
      bucket_id: bucketId || "",
      query: searchString
    })
  }, [imployApiClient])

  // const setPassword = async (password: string) => {
  //   if (!masterPassword && (await validateMasterPassword(password))) {
  //     setMasterPassword(password)
  //   } else {
  //     console.log(
  //       "The password is already set, or an incorrect password was entered.",
  //     )
  //     return false
  //   }
  // }

  return (
    <DriveContext.Provider
      value={{
        uploadFiles,
        createFolder,
        renameFile,
        moveFile,
        moveFiles,
        moveCSFObject,
        removeCSFObjects,
        downloadFile,
        getFileContent,
        list,
        uploadsInProgress,
        spaceUsed,
        downloadsInProgress,
        getFolderTree,
        listBuckets,
        searchFiles,
        getFileInfo,
        secureAccountWithMasterPassword
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
  BucketType,
  SearchEntry
}
