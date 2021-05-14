import { Crumb } from "@chainsafe/common-components"
import React, { useContext } from "react"
import { FileOperation, IBulkOperations, IFilesBrowserModuleProps } from "../Components/Modules/FileBrowsers/types"
import { BucketType, FileSystemItem, UploadProgress } from "./DriveContext"

interface FileBrowserContext extends IFilesBrowserModuleProps {
  itemOperations: {[contentType: string]: FileOperation[]}

  bulkOperations?: IBulkOperations
  handleRename?: (path: string, new_path: string) => Promise<void>
  handleMove?: (path: string, new_path: string) => Promise<void>
  downloadFile?: (cid: string) => Promise<void>
  deleteFiles?: (cid: string[]) => Promise<void>
  recoverFile?: (cid: string) => Promise<void>
  recoverFiles?: (cid: string[]) => Promise<void[]>
  viewFolder?: (cid: string) => void
  allowDropUpload?: boolean

  handleUploadOnDrop?: (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => void

  refreshContents?: () => void
  currentPath: string
  bucketType: BucketType
  loadingCurrentPath: boolean
  uploadsInProgress?: UploadProgress[]
  showUploadsInTable: boolean
  sourceFiles: FileSystemItem[]
  crumbs: Crumb[] | undefined
  moduleRootPath: string | undefined
  getPath?: (cid: string) => string
  isSearch?: boolean
  withSurvey?: boolean
}

const FileBrowserContext = React.createContext<FileBrowserContext | undefined>()

const useFileBrowser = () => {
  const context = useContext(FileBrowserContext)
  if (context === undefined) {
    throw new Error("useFileBrowserContext must be called within a FileBrowserProvider")
  }
  return context
}

export { FileBrowserContext, useFileBrowser }
