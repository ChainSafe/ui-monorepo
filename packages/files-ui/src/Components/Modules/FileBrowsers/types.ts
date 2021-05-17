import { Crumb } from "@chainsafe/common-components"
import { BucketType, FileSystemItem, UploadProgress } from "../../../Contexts/DriveContext"

export type FileOperation =
  | "rename"
  | "delete"
  | "download"
  | "share"
  | "move"
  | "info"
  | "recover"
  | "preview"
  | "view_folder"

export type BrowserView = "grid" | "table"

export interface IFilesBrowserModuleProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
}

export interface IBulkOperations {
  [index: string]: FileOperation[]
}

export interface IFilesTableBrowserProps
  extends Omit<IFilesBrowserModuleProps, "fileOperations" | "folderOperations"> {
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
