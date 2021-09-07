import {
  FileContentResponse,
  DirectoryContentResponse,
  BucketType,
  Bucket as FilesBucket,
  SearchEntry,
  BucketFileFullInfoResponse,
  BucketSummaryResponse,
  LookupUser
} from "@chainsafe/files-api-client"
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { decryptFile, encryptFile  } from "../Utils/encryption"
import { v4 as uuidv4 } from "uuid"
import { ToastParams, useToasts } from "@chainsafe/common-components"
import axios, { CancelToken } from "axios"
import { plural, t } from "@lingui/macro"
import { parseFileContentResponse, readFileAsync } from "../Utils/Helpers"
import { useBeforeunload } from "react-beforeunload"
import { useThresholdKey } from "./ThresholdKeyContext"
import { useFilesApi } from "./FilesApiContext"
import { useUser } from "./UserContext"
import { getPathWithFile, getRelativePath } from "../Utils/pathUtils"
import { Zippable, zipSync } from "fflate"

type FilesContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type SharedFolderUser = {
  uuid: string
  pubKey: string
}

export type UpdateSharedFolderUser = {
  uuid: string
  pubKey?: string
  encryption_key?: string
}

interface GetFileContentParams {
  cid: string
  cancelToken?: CancelToken
  onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void
  file: FileSystemItem
  path: string
}

export type BucketPermission = "writer" | "owner" | "reader"

export type BucketKeyPermission = Omit<FilesBucket, "owners" | "writers" | "readers"> & {
  encryptionKey: string
  permission?: BucketPermission
  owners: LookupUser[]
  writers: LookupUser[]
  readers: LookupUser[]
}

type FilesContext = {
  buckets: BucketKeyPermission[]
  storageSummary: BucketSummaryResponse | undefined
  personalEncryptionKey: string | undefined
  getStorageSummary: () => Promise<void>
  uploadFiles: (bucket: BucketKeyPermission, files: File[], path: string, encryptionKey?: string) => Promise<void>
  downloadFile: (bucketId: string, itemToDownload: FileSystemItem, path: string) => void
  getFileContent: (bucketId: string, params: GetFileContentParams) => Promise<Blob | undefined>
  refreshBuckets: (showLoading?: boolean) => Promise<void>
  secureAccountWithMasterPassword: (candidatePassword: string) => Promise<void>
  isLoadingBuckets?: boolean
  createSharedFolder: (
    name: string,
    writers?: SharedFolderUser[],
    readers?: SharedFolderUser[]
  ) => Promise<BucketKeyPermission | void>
  editSharedFolder: (
    bucket: BucketKeyPermission,
    writers?: UpdateSharedFolderUser[],
    readers?: UpdateSharedFolderUser[]
  ) => Promise<void>
  transferFileBetweenBuckets: (
    sourceBucketId: string,
    sourceFile: FileSystemItem,
    path: string,
    destinationBucket: BucketKeyPermission,
    deleteFromSource?: boolean
  ) => Promise<void>
  downloadMultipleFiles: (fileItems: FileSystemItem[], currentPath: string, bucketId: string) => void
}

// This represents a File or Folder
export interface FileSystemItem extends FileContentResponse {
  isFolder: boolean
}

interface FileSystemItemPath extends FileSystemItem {
  path: string
}

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
  const { addToast, updateToast } = useToasts()
  const [personalEncryptionKey, setPersonalEncryptionKey] = useState<string | undefined>()
  const [buckets, setBuckets] = useState<BucketKeyPermission[]>([])
  const [storageSummary, setStorageSummary] = useState<BucketSummaryResponse | undefined>()
  const { profile } = useUser()
  const { userId } = profile || {}
  const [isLoadingBuckets, setIsLoadingBuckets] = useState(false)

  const getStorageSummary = useCallback(async () => {
    try {
      const bucketSummaryData = await filesApiClient.bucketsSummary()
      setStorageSummary(bucketSummaryData)
    } catch (error) {
      console.error(error)
    }
  }, [filesApiClient, setStorageSummary])

  const getPermissionForBucket = useCallback((bucket: FilesBucket) => {
    return bucket.owners.find(owner => owner.uuid === userId)
      ? "owner" as BucketPermission
      : bucket.writers.find(writer => writer.uuid === userId)
        ? "writer" as BucketPermission
        : bucket.readers.find(reader => reader.uuid === userId)
          ? "reader" as BucketPermission
          : undefined
  }, [userId])

  const getKeyForSharedBucket = useCallback(async (bucket: FilesBucket) => {
    const bucketUsers = [...bucket.readers, ...bucket.writers, ...bucket.owners]
    const bucketUser = bucketUsers.find(bu => bu.uuid === userId)

    if (!bucketUser?.encryption_key) {
      console.error(`Unable to retrieve encryption key for ${bucket.id}`)
      return ""
    }

    const decrypted = await decryptMessageWithThresholdKey(bucketUser.encryption_key)

    return decrypted || ""
  }, [decryptMessageWithThresholdKey, userId])

  const getKeyForBucket = useCallback(async (bucket: FilesBucket) => {
    if (!personalEncryptionKey || !userId) return

    let encryptionKey = ""

    switch(bucket.type) {
    case "csf":
    case "trash": {
      encryptionKey = personalEncryptionKey
      break
    }
    case "share": {
      encryptionKey = await getKeyForSharedBucket(bucket)
      break
    }}

    return encryptionKey
  }, [getKeyForSharedBucket, personalEncryptionKey, userId])

  const refreshBuckets = useCallback(async (showLoading?: boolean) => {
    if (!personalEncryptionKey || !userId) return

    showLoading && setIsLoadingBuckets(true)
    const result = await filesApiClient.listBuckets()

    const bucketsWithKeys: BucketKeyPermission[] = await Promise.all(
      result.map(async (b) => {
        const userData = await filesApiClient.getBucketUsers(b.id)
        return {
          ...b,
          encryptionKey: await getKeyForBucket(b) || "",
          permission: getPermissionForBucket(b),
          owners: userData.owners || [],
          writers: userData.writers || [],
          readers: userData.readers || []
        }
      })
    )
    setBuckets(bucketsWithKeys)
    setIsLoadingBuckets(false)
    getStorageSummary()
    return Promise.resolve()
  }, [personalEncryptionKey, userId, filesApiClient, getStorageSummary, getKeyForBucket, getPermissionForBucket])

  useEffect(() => {
    refreshBuckets(true)
  }, [refreshBuckets])

  // Space used counter
  useEffect(() => {
    if (isLoggedIn) {
      getStorageSummary()
    }
  }, [isLoggedIn, getStorageSummary, profile])

  // Reset encryption keys on log out
  useEffect(() => {
    if (!isLoggedIn) {
      setPersonalEncryptionKey(undefined)
      setBuckets([])
    }
  }, [isLoggedIn])

  const secureAccount = useCallback(() => {
    if (!publicKey) return

    const key = Buffer.from(
      window.crypto.getRandomValues(new Uint8Array(32))
    ).toString("base64")
    console.log("New key", key)
    setPersonalEncryptionKey(key)
    encryptForPublicKey(publicKey, key)
      .then((encryptedKey) => {
        console.log("Encrypted encryption key", encryptedKey)
        secureThresholdKeyAccount(encryptedKey)
      })
      .catch(console.error)
  }, [encryptForPublicKey, publicKey, secureThresholdKeyAccount])

  const decryptKey = useCallback((encryptedKey: string) => {
    console.log("Decrypting retrieved key")

    decryptMessageWithThresholdKey(encryptedKey)
      .then((decryptedKey) => {
        console.log("Decrypted key: ", decryptedKey)
        setPersonalEncryptionKey(decryptedKey)
      })
      .catch(console.error)
  }, [decryptMessageWithThresholdKey])

  // Drive encryption handler
  useEffect(() => {
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
    isMasterPasswordSet,
    secureAccount,
    decryptKey,
    isLoadingBuckets
  ])

  const secureAccountWithMasterPassword = async (candidatePassword: string) => {
    if (!publicKey || !validateMasterPassword(candidatePassword)) return

    const encryptedKey = await encryptForPublicKey(publicKey, candidatePassword)
    setPersonalEncryptionKey(candidatePassword)
    secureThresholdKeyAccount(encryptedKey)
  }

  const [uploadsInProgress, setUploadsInProgress] = useState(false)
  const [downloadsInProgress, setDownloadsInProgress] = useState(false)
  const [transfersInProgress, setTransfersInProgress] = useState(false)
  const [closeIntercept, setCloseIntercept] = useState<string | undefined>()

  useEffect(() => {
    if (downloadsInProgress) {
      setCloseIntercept("Download in progress, are you sure?")
    } else if (uploadsInProgress) {
      setCloseIntercept("Upload in progress, are you sure?")
    } else if (transfersInProgress) {
      setCloseIntercept("Transfer is in progress, are you sure?")
    } else if (closeIntercept !== undefined) {
      setCloseIntercept(undefined)
    }
  }, [closeIntercept, downloadsInProgress, uploadsInProgress, transfersInProgress])

  useBeforeunload(() => {
    if (closeIntercept !== undefined) {
      return closeIntercept
    }
  })

  const encryptAndUploadFiles = useCallback(async (
    bucket: BucketKeyPermission,
    files: File[],
    path: string,
    onUploadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void) => {

    const key = bucket.encryptionKey

    if (!key) {
      console.error("No encryption key for this bucket available.")
      return
    }
    const filesParam = await Promise.all(
      files
        .filter((f) => f.size <= MAX_FILE_SIZE)
        .map(async (f) => {
          const fileData = await readFileAsync(f)
          const encryptedData = await encryptFile(fileData, key)
          return {
            data: new Blob([encryptedData], { type: f.type }),
            fileName: f.name
          }
        })
    )

    await filesApiClient.uploadBucketObjects(
      bucket.id,
      filesParam,
      path,
      undefined,
      1,
      undefined,
      undefined,
      onUploadProgress
    )
  }, [filesApiClient])

  const uploadFiles = useCallback(async (bucket: BucketKeyPermission, files: File[], path: string) => {
    const hasOversizedFile = files.some(file => file.size > MAX_FILE_SIZE)
    if (hasOversizedFile) {
      addToast({
        title: t`We can't encrypt files larger than 2GB. Some items will not be uploaded`,
        type: "error"
      })
    }

    const toastParams: ToastParams = {
      title: plural(files.length, {
        one: `Encrypting and uploading ${files.length} file`,
        other: `Encrypting and uploading ${files.length} files`
      }) as string,
      type: "success",
      progress: 0,
      toastPosition: "bottom-right"
    }

    const toastId = addToast(toastParams)
    setUploadsInProgress(true)

    try {
      await encryptAndUploadFiles(
        bucket,
        files,
        path,
        (progressEvent: { loaded: number; total: number }) => {
          updateToast(toastId, {
            ...toastParams,
            progress: Math.ceil(
              (progressEvent.loaded / progressEvent.total) * 100
            )
          })
        }
      )
      setUploadsInProgress(false)

      await refreshBuckets()
      // setting complete
      updateToast(toastId, {
        ...toastParams,
        title: "Upload complete",
        progress: undefined
      }, true)
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      setUploadsInProgress(false)
      // setting error
      let errorMessage = t`Something went wrong. We couldn't upload your file`

      // we will need a method to parse server errors
      if (Array.isArray(error) && error[0].message.includes("conflict")) {
        errorMessage = t`A file with the same name already exists`
      }
      updateToast(toastId, {
        ...toastParams,
        title: errorMessage,
        type: "error",
        progress: undefined
      }, true)

      return Promise.reject(error)
    }
  }, [addToast, updateToast, refreshBuckets, encryptAndUploadFiles])

  const getFileContent = useCallback(async (
    bucketId: string,
    { cid, cancelToken, onDownloadProgress, file, path }: GetFileContentParams
  ) => {
    const key = buckets.find(b => b.id === bucketId)?.encryptionKey

    if (!key) {
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
      const result = await filesApiClient.getBucketObjectContent(
        bucketId,
        { path: path },
        cancelToken,
        onDownloadProgress
      )

      if (fileToGet.version === 0) {
        return result.data
      } else {
        const decrypted = await decryptFile(
          await result.data.arrayBuffer(),
          key
        )
        if (decrypted) {
          return new Blob([decrypted], {
            type: fileToGet.content_type
          })
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return Promise.reject()
      } else {
        console.error(error)
        return Promise.reject(error)
      }
    }
  }, [buckets, filesApiClient])

  const getFileList = useCallback(async (
    itemsToDownload: FileSystemItem[],
    currentPath: string,
    bucketId: string
  ): Promise<FileSystemItemPath[]>  => {
    return await itemsToDownload.reduce(
      async (acc: Promise<FileSystemItemPath[]>, item: FileSystemItem): Promise<FileSystemItemPath[]> => {
        if (item.isFolder) {
          const folderPath = getPathWithFile(currentPath, item.name)
          const newList = await filesApiClient.getBucketObjectChildrenList(bucketId, { path: folderPath })

          const childFolderItems = newList.map(parseFileContentResponse)
          return childFolderItems.length
            ? [...await acc, ...await getFileList(childFolderItems, folderPath, bucketId)]
            : Promise.resolve(acc)
        }

        return [...await acc, { ...item, path: currentPath }]
      }, Promise.resolve([] as FileSystemItemPath[]))
  }, [filesApiClient])

  const downloadMultipleFiles = useCallback((itemsToDownload: FileSystemItem[], currentPath: string, bucketId: string) => {
    getFileList(itemsToDownload, currentPath, bucketId)
      .then(async (fullStructure) => {
        const zipList: Zippable = {}

        const totalFileSize = fullStructure.reduce((sum, item) => sum + item.size, 0)
        const totalFileNumber = fullStructure.length

        const toastParams: ToastParams = {
          title: plural(fullStructure.length, {
            one: `Downloading ${fullStructure.length} file`,
            other: `Downloading ${fullStructure.length} files`
          }) as string,
          type: "success",
          progress: 0,
          toastPosition: "bottomRight"
        }

        const toastId = addToast(toastParams)

        // if there are no file to download return early and show an error
        if (!totalFileNumber) {
          updateToast(toastId, {
            title: t`No file to download.`,
            type: "error",
            progress: undefined
          }, true)
          return
        }

        // Idea for parallel download https://glebbahmutov.com/blog/run-n-promises-in-parallel/
        // we need to use a reduce here because forEach doesn't wait for the Promise to resolve
        await fullStructure.reduce(async (totalDownloaded: Promise<number>, item: FileSystemItemPath, index: number): Promise<number> => {
          const file = await getFileContent(bucketId, {
            cid: item.cid,
            file: item,
            path: getPathWithFile(item.path, item.name),
            onDownloadProgress: async (progressEvent) => {
              const currentFileNumber = index + 1
              const fileProgress = totalFileNumber > 1 && `${currentFileNumber}/${totalFileNumber}`
              updateToast(toastId, {
                ...toastParams,
                title: t`Downloading ${fileProgress} - ${item.name}`,
                progress: Math.ceil(
                  ((await totalDownloaded + progressEvent.loaded) / totalFileSize) * 100
                )
              })
            }
          })

          if(file) {
            const fileArrayBuffer = await file.arrayBuffer()
            const fullPath = getPathWithFile(item.path, item.name)
            const relativeFilePath = getRelativePath(fullPath, currentPath)
            zipList[relativeFilePath] = new Uint8Array(fileArrayBuffer)
          }

          return await totalDownloaded + item.size
        }, Promise.resolve(0))

        // level 0 means without compression
        const zipped = zipSync(zipList, { level: 0 })

        if (!zipped) return

        const link = document.createElement("a")
        link.href = URL.createObjectURL(new Blob([zipped]))
        link.download = "archive.zip"
        link.click()

        updateToast(toastId, {
          title: t`Download Complete`,
          type: "success",
          progress: undefined
        }, true)

        URL.revokeObjectURL(link.href)

      })
      .catch(console.error)
  }, [getFileContent, getFileList, addToast, updateToast])

  const downloadFile = useCallback(async (bucketId: string, itemToDownload: FileSystemItem, path: string) => {
    const toastId = uuidv4()
    try {
      const toastParams: ToastParams = {
        title: t`Downloading file - ${itemToDownload.name}`,
        type: "success",
        progress: 0,
        toastPosition: "bottomRight"
      }
      const toastId = addToast(toastParams)
      setDownloadsInProgress(true)

      const result = await getFileContent(bucketId, {
        cid: itemToDownload.cid,
        file: itemToDownload,
        path: getPathWithFile(path, itemToDownload.name),
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
        progress: undefined
      }, true)
      URL.revokeObjectURL(link.href)
      setDownloadsInProgress(false)
      return Promise.resolve()
    } catch (error) {
      updateToast(toastId, {
        title: t`Download failed`,
        type: "error",
        progress: undefined
      }, true)
      setDownloadsInProgress(false)
      return Promise.reject()
    }
  }, [getFileContent, addToast, updateToast])

  const createSharedFolder = useCallback(async (name: string, writerUsers?: SharedFolderUser[], readerUsers?: SharedFolderUser[]) =>  {
    if (!publicKey) return

    const bucketEncryptionKey = Buffer.from(
      window.crypto.getRandomValues(new Uint8Array(32))
    ).toString("base64")

    const ownerEncryptedEncryptionKey = await encryptForPublicKey(publicKey, bucketEncryptionKey)

    const readers = readerUsers ? await Promise.all(readerUsers?.map(async u => ({
      uuid: u.uuid,
      encryption_key: await encryptForPublicKey(u.pubKey, bucketEncryptionKey)
    }))) : []

    const writers = writerUsers ? await Promise.all(writerUsers?.map(async u => ({
      uuid: u.uuid,
      encryption_key: await encryptForPublicKey(u.pubKey, bucketEncryptionKey)
    }))) : []

    return filesApiClient.createBucket({
      name,
      encryption_key: ownerEncryptedEncryptionKey,
      type: "share",
      readers,
      writers
    }).then(async (bucket) => {
      refreshBuckets(false)

      return {
        ...bucket,
        encryptionKey: await getKeyForBucket(bucket) || "",
        permission: getPermissionForBucket(bucket)
      } as BucketKeyPermission
    })
      .catch(console.error)
  }, [publicKey, encryptForPublicKey, filesApiClient, refreshBuckets, getKeyForBucket, getPermissionForBucket])

  const editSharedFolder = useCallback(
    async (bucket: BucketKeyPermission, writerUsers?: UpdateSharedFolderUser[], readerUsers?: UpdateSharedFolderUser[]) => {
      if (!publicKey) return

      const readers = readerUsers ? await Promise.all(readerUsers?.map(async u => {
        return u.pubKey ? {
          uuid: u.uuid,
          encryption_key: await encryptForPublicKey(u.pubKey, bucket.encryptionKey)
        } : {
          uuid: u.uuid,
          encryption_key: u.encryption_key
        }
      })) : []

      const writers = writerUsers ? await Promise.all(writerUsers?.map(async u => {
        return u.pubKey ? {
          uuid: u.uuid,
          encryption_key: await encryptForPublicKey(u.pubKey, bucket.encryptionKey)
        } : {
          uuid: u.uuid,
          encryption_key: u.encryption_key
        }
      })) : []

      return filesApiClient.updateBucket(bucket.id, {
        name: bucket.name,
        readers,
        writers
      }).then(() => refreshBuckets(false))
        .catch(console.error)
    }, [filesApiClient, encryptForPublicKey, publicKey, refreshBuckets])

  const transferFileBetweenBuckets = useCallback(async (
    sourceBucketId: string,
    sourceFile: FileSystemItem,
    path: string,
    destinationBucket: BucketKeyPermission,
    keepOriginal = true
  ) => {
    const UPLOAD_PATH = "/"

    const toastParams: ToastParams = {
      title: t`Sharing your file (Downloading)`,
      type: "success",
      progress: 0,
      toastPosition: "bottomRight"
    }
    const toastId = addToast(toastParams)
    setTransfersInProgress(true)

    getFileContent(sourceBucketId, {
      cid: sourceFile.cid,
      file: sourceFile,
      path: getPathWithFile(path, sourceFile.name),
      onDownloadProgress: (progressEvent) => {
        updateToast(toastId, {
          ...toastParams,
          progress: Math.ceil(
            (progressEvent.loaded / sourceFile.size) * 50
          )
        })
      }
    }).then(async (fileContent) => {
      if (!fileContent) {
        updateToast(toastId, {
          title: t`An error occurred while downloading the file`,
          type: "error",
          progress: undefined
        }, true)
        setTransfersInProgress(false)
        return
      }

      await encryptAndUploadFiles(
        destinationBucket,
        [new File([fileContent], sourceFile.name, { type: sourceFile.content_type })],
        UPLOAD_PATH,
        (progressEvent) => {
          updateToast(toastId, {
            title: t`Encrypting & uploading`,
            type: "success",
            progress:  Math.ceil(
              50 + (progressEvent.loaded / sourceFile.size) * 50
            )
          })
        }
      )

      if (!keepOriginal) {
        await filesApiClient.removeBucketObject(sourceBucketId, { paths: [getPathWithFile(path, sourceFile.name)] })
      }
      updateToast(toastId, {
        title: t`Transfer complete`,
        type: "success",
        progress: undefined
      }, true)
      setTransfersInProgress(false)
      return Promise.resolve()
    }).catch((error) => {
      console.error(error[0].message)
      updateToast(toastId, {
        title: `${t`An error occurred: `} ${typeof(error) === "string" ? error : error[0].message}`,
        type: "error",
        progress: undefined
      }, true)
      setTransfersInProgress(false)
    }).finally(() => {
      refreshBuckets()
    })
  }, [getFileContent, encryptAndUploadFiles, filesApiClient, refreshBuckets, addToast, updateToast])

  return (
    <FilesContext.Provider
      value={{
        uploadFiles,
        downloadFile,
        downloadMultipleFiles,
        getFileContent,
        personalEncryptionKey,
        storageSummary,
        getStorageSummary,
        secureAccountWithMasterPassword,
        buckets,
        refreshBuckets,
        isLoadingBuckets,
        createSharedFolder,
        editSharedFolder,
        transferFileBetweenBuckets
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
  DirectoryContentResponse,
  BucketFileFullInfoResponse as FileFullInfo,
  BucketType,
  SearchEntry
}
