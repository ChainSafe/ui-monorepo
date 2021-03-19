import {
  CSFFilesFullinfoResponse,
  FileContentResponse,
  FilesMvRequest,
  FilesPathRequest,
  DirectoryContentResponse,
  BucketType,
  SearchEntry
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
import { guessContentType } from "../Utils/contentTypeGuesser"
import { CancelToken } from "axios"
import { t } from "@lingui/macro"
import { readFileAsync } from "../Utils/Helpers"
import { useBeforeunload } from "react-beforeunload"
import { getPathWithFile } from "../Utils/pathUtils"
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

type DriveContext = {
  uploadFiles(files: File[], path: string): void
  createFolder(body: FilesPathRequest): Promise<FileContentResponse>
  renameFile(body: FilesMvRequest): Promise<void>
  moveFile(body: FilesMvRequest): Promise<void>
  bulkMoveFile(cid: FilesMvRequest[]): Promise<void>
  recoverFile(cid: string): Promise<void>
  deleteFile(cid: string): Promise<void>
  bulkMoveFileToTrash(cid: string[]): Promise<void>
  moveFileToTrash(cid: string): Promise<void>
  downloadFile(cid: string): Promise<void>
  getFileContent(
    cid: string,
    cancelToken?: CancelToken,
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void,
  ): Promise<Blob | undefined>
  list(body: FilesPathRequest): Promise<FileContentResponse[]>
  currentPath: string
  updateCurrentPath(
    newPath: string,
    bucketType?: BucketType,
    showLoading?: boolean,
  ): void
  pathContents: FileSystemItem[]
  uploadsInProgress: UploadProgress[]
  downloadsInProgress: DownloadProgress[]
  spaceUsed: number
  getFolderTree(): Promise<DirectoryContentResponse>
  getFileInfo(path: string): Promise<CSFFilesFullinfoResponse>
  getSearchResults(searchString: string): Promise<SearchEntry[]>
  currentSearchBucket:
    | {
        bucketType: BucketType
        bucketId: string
      }
    | undefined
  bucketType: BucketType
  loadingCurrentPath: boolean
  secureAccountWithMasterPassword(candidatePassword: string): void
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

  const {
    publicKey,
    encryptForPublicKey,
    decryptMessageWithThresholdKey
  } = useThresholdKey()
  const { addToastMessage } = useToaster()

  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)

  const [bucketType, setBucketType] = useState<BucketType>("csf")

  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const [spaceUsed, setSpaceUsed] = useState(0)

  const [currentSearchBucket, setCurrentSearchBucket] = useState<
    | {
        bucketId: string
        bucketType: BucketType
      }
    | undefined
  >(undefined)

  const [encryptionKey, setEncryptionKey] = useState<string | undefined>(
    undefined
  )

  const refreshContents = useCallback(
    async (
      path: string,
      bucketTypeParam?: BucketType,
      showLoading?: boolean
    ) => {
      try {
        showLoading && setLoadingCurrentPath(true)
        const newContents = await imployApiClient?.getCSFChildList({
          path,
          source: {
            type: bucketTypeParam || bucketType
          }
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
                fcr.content_type === "application/chainsafe-files-directory"
            }))
          )
        }
      } catch (error) {
        showLoading && setLoadingCurrentPath(false)
      }
    },
    [imployApiClient, bucketType]
  )

  const currentPathReducer = (
    currentPath: string,
    action:
      | { type: "update"; payload: string }
      | { type: "refreshOnSamePath"; payload: string }
  ): string => {
    switch (action.type) {
    case "update": {
      return action.payload
    }
    case "refreshOnSamePath": {
      // check user has not navigated to other folder
      // using then catch as awaits won't work in reducer
      if (action.payload === currentPath) {
        refreshContents(currentPath, bucketType, false)
      }
      return currentPath
    }
    default:
      return currentPath
    }
  }
  const [currentPath, dispatchCurrentPath] = useReducer(currentPathReducer, "/")

  const setCurrentPath = (
    newPath: string,
    newBucketType?: BucketType,
    showLoading?: boolean
  ) => {
    dispatchCurrentPath({ type: "update", payload: newPath })
    if (newBucketType) {
      setBucketType(newBucketType)
    }
    refreshContents(newPath, newBucketType || bucketType, showLoading)
  }

  // Ensure path contents are refreshed
  useEffect(() => {
    if (isLoggedIn) {
      refreshContents("/")
    }
  }, [imployApiClient, refreshContents, isLoggedIn])

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
  }, [imployApiClient, pathContents, isLoggedIn])

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

  const uploadFiles = async (files: File[], path: string) => {
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
          payload: { id, errorMessage }
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

  const renameFile = async (body: FilesMvRequest) => {
    try {
      if (body.path !== body.new_path) {
        await imployApiClient.moveCSFObject(body)
        await refreshContents(currentPath)
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
  }

  const moveFile = async (body: FilesMvRequest) => {
    try {
      await imployApiClient.moveCSFObject(body)
      await refreshContents(currentPath)
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
  }

  const bulkMoveFile = async (filesToMove: FilesMvRequest[]) => {
    for (let i = 0; i < filesToMove.length; i++) {
      await moveFile(filesToMove[i])
    }
  }

  const deleteFile = async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)
    if (!itemToDelete) return
    try {
      await imployApiClient.removeCSFObjects({
        paths: [`${currentPath}${itemToDelete.name}`],
        source: {
          type: bucketType
        }
      })
      await refreshContents(currentPath)
      const message = `${
        itemToDelete.isFolder ? t`Folder` : t`File`
      } ${t`deleted successfully`}`
      addToastMessage({
        message: message,
        appearance: "success"
      })
      return Promise.resolve()
    } catch (error) {
      const message = `${t`There was an error deleting this`} ${
        itemToDelete.isFolder ? t`folder` : t`file`
      }`
      addToastMessage({
        message: message,
        appearance: "error"
      })
      return Promise.reject()
    }
  }

  const moveFileToTrash = async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)
    if (!itemToDelete) return
    try {
      await imployApiClient.moveCSFObject({
        path: getPathWithFile(currentPath, itemToDelete.name),
        new_path: getPathWithFile("/", itemToDelete.name),
        destination: {
          type: "trash"
        }
      })
      await refreshContents(currentPath)
      const message = `${
        itemToDelete.isFolder ? t`Folder` : t`File`
      } ${t`deleted successfully`}`
      addToastMessage({
        message: message,
        appearance: "success"
      })
      return Promise.resolve()
    } catch (error) {
      const message = `${t`There was an error deleting this`} ${
        itemToDelete.isFolder ? t`folder` : t`file`
      }`
      addToastMessage({
        message: message,
        appearance: "error"
      })
      return Promise.reject()
    }
  }

  const bulkMoveFileToTrash = async (cidsToTrash: string[]) => {
    for (let i = 0; i < cidsToTrash.length; i++) {
      await moveFileToTrash(cidsToTrash[i])
    }
  }

  const recoverFile = async (cid: string) => {
    const itemToRestore = pathContents.find((i) => i.cid === cid)
    if (!itemToRestore) return
    try {
      await imployApiClient.moveCSFObject({
        path: getPathWithFile("/", itemToRestore.name),
        new_path: getPathWithFile("/", itemToRestore.name),
        source: {
          type: "trash"
        },
        destination: {
          type: "csf"
        }
      })
      await refreshContents(currentPath)

      const message = `${
        itemToRestore.isFolder ? t`Folder` : t`File`
      } ${t`recovered successfully`}`

      addToastMessage({
        message: message,
        appearance: "success"
      })
      return Promise.resolve()
    } catch (error) {
      const message = `${t`There was an error recovering this`} ${
        itemToRestore.isFolder ? t`folder` : t`file`
      }`
      addToastMessage({
        message: message,
        appearance: "error"
      })
      return Promise.reject()
    }
  }

  const getFileContent = async (
    cid: string,
    cancelToken?: CancelToken,
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void
  ) => {
    if (!encryptionKey) return // TODO: Add better error handling here.
    const file = pathContents.find((i) => i.cid === cid)
    if (!file) return
    try {
      const result = await imployApiClient.getFileContent(
        {
          path: currentPath + file.name
        },
        cancelToken,
        onDownloadProgress
      )

      if (file.version === 0) {
        return result.data
      } else {
        const decrypted = await decryptFile(
          await result.data.arrayBuffer(),
          encryptionKey
        )
        if (decrypted) {
          return new Blob([decrypted], {
            type: file.content_type
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
        progress: 0
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
                (progressEvent.loaded / itemToDownload.size) * 100
              )
            }
          })
        }
      )
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
  }

  const list = async (body: FilesPathRequest) => {
    try {
      return imployApiClient.getCSFChildList(body)
    } catch (error) {
      return Promise.reject()
    }
  }

  const getSearchResults = async (searchString: string) => {
    try {
      if (!searchString) return []
      let bucketId
      if (
        currentSearchBucket &&
        currentSearchBucket.bucketType === bucketType
      ) {
        // we have the bucket id
        bucketId = currentSearchBucket.bucketId
      } else {
        // fetch bucket id
        const results = await imployApiClient.listBuckets(bucketType)
        const bucket1 = results[0]
        setCurrentSearchBucket({
          bucketType,
          bucketId: bucket1.id
        })
        bucketId = bucket1.id
      }
      const results = await imployApiClient.searchFiles({
        bucket_id: bucketId || "",
        query: searchString
      })
      return results
    } catch (err) {
      addToastMessage({
        message: t`There was an error getting search results`,
        appearance: "error"
      })
      return Promise.reject(err)
    }
  }

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
        bulkMoveFile,
        deleteFile,
        moveFileToTrash,
        bulkMoveFileToTrash,
        downloadFile,
        getFileContent,
        recoverFile,
        list,
        currentPath,
        updateCurrentPath: (
          newPath: string,
          bucketType?: BucketType,
          showLoading?: boolean
        ) => {
          newPath.endsWith("/")
            ? setCurrentPath(`${newPath}`, bucketType, showLoading)
            : setCurrentPath(`${newPath}/`, bucketType, showLoading)
        },
        pathContents,
        uploadsInProgress,
        spaceUsed,
        downloadsInProgress,
        getFolderTree,
        getSearchResults,
        currentSearchBucket,
        loadingCurrentPath,
        getFileInfo,
        bucketType,
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
