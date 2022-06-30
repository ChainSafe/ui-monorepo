import { Crumb } from "@chainsafe/common-components"
import React, { useContext } from "react"
import { FileOperation, IBulkOperations, IFileBrowserModuleProps } from "../Components/Modules/FileBrowsers/types"
import { BucketKeyPermission, FileSystemItem } from "./FilesContext"

interface FileBrowserContext extends IFileBrowserModuleProps {
  bucket?: BucketKeyPermission
  itemOperations: {[contentType: string]: FileOperation[]}
  bulkOperations?: IBulkOperations
  renameItem?: (cid: string, newName: string) => Promise<void>
  moveItems?: (cids: string[], newPath: string) => Promise<void>
  downloadFile?: (cid: string) => Promise<void>
  deleteItems?: (cid: string[], hideToast?: boolean) => Promise<void>
  recoverItems?: (cid: string[], newPath: string) => Promise<void>
  viewFolder?: (cid: string) => void
  allowDropUpload?: boolean

  handleUploadOnDrop?: (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => void

  refreshContents?: () => void
  currentPath: string
  loadingCurrentPath: boolean
  showUploadsInTable: boolean
  sourceFiles: FileSystemItem[]
  crumbs?: Crumb[]
  moduleRootPath?: string
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
