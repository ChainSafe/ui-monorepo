import { Crumb } from "@chainsafe/common-components"
import React, { useContext } from "react"
import { FileOperation, IBulkOperations, IFileBrowserModuleProps } from "../Components/Modules/FileBrowsers/types"
import { FileSystemItem, UploadProgress } from "./FilesContext"
import { Bucket } from "@chainsafe/files-api-client"
interface FileBrowserContext extends IFileBrowserModuleProps {
  bucket?: Bucket
  itemOperations: {[contentType: string]: FileOperation[]}
  bulkOperations?: IBulkOperations
  renameItem?: (cid: string, newName: string) => Promise<void>
  moveItems?: (cids: string[], newPath: string) => Promise<void>
  downloadFile?: (cid: string) => Promise<void>
  deleteItems?: (cid: string[]) => Promise<void>
  recoverItems?: (cid: string[]) => Promise<void[]>
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
