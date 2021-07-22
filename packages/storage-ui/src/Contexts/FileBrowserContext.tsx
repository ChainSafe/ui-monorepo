import { Crumb } from "@chainsafe/common-components"
import React, { useContext } from "react"
import { FileOperation, IBulkOperations, IFileBrowserModuleProps } from "./types"
import { Bucket } from "@chainsafe/files-api-client"
import { FileSystemItem, UploadProgress } from "./StorageContext"

export interface ISelectedFile {
  cid: string
  name: string
}

interface FileBrowserContext extends IFileBrowserModuleProps {
  bucket?: Bucket
  itemOperations: {[contentType: string]: FileOperation[]}
  bulkOperations?: IBulkOperations
  renameItem?: (toRename: ISelectedFile, newName: string) => Promise<void>
  moveItems?: (toMove: ISelectedFile[], newPath: string) => Promise<void>
  downloadFile?: (toDownload: ISelectedFile) => Promise<void>
  deleteItems?: (toDelete: ISelectedFile[]) => Promise<void>
  recoverItems?: (toRecover: ISelectedFile[], newPath: string) => Promise<void>
  viewFolder?: (cid: ISelectedFile) => void
  allowDropUpload?: boolean

  handleUploadOnDrop?: (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => void

  refreshContents?: () => void
  currentPath: string
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

const FileBrowserContext = React.createContext<FileBrowserContext | undefined>(undefined)

const useFileBrowser = () => {
  const context = useContext(FileBrowserContext)
  if (context === undefined) {
    throw new Error("useFileBrowserContext must be called within a FileBrowserProvider")
  }
  return context
}

export { FileBrowserContext, useFileBrowser }
