import { Crumb } from "@chainsafe/common-components"
import {
  FileSystemItem,
  StoreEntryType,
  UploadProgress,
} from "../../../Contexts/DriveContext"

export type FileOperation =
  | "rename"
  | "delete"
  | "download"
  | "share"
  | "move"
  | "info"
  | "recover"
  | "preview"

export interface IFilesBrowserModuleProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
}

export interface IFileConfigured extends FileSystemItem {
  operations: FileOperation[]
}

export interface IFilesTableBrowserProps extends IFilesBrowserModuleProps {
  handleRename?: (path: string, new_path: string) => Promise<void>
  handleMove?: (path: string, new_path: string) => Promise<void>
  downloadFile?: (cid: string) => Promise<void>
  deleteFile?: (cid: string) => Promise<void>
  recoverFile?: (cid: string) => Promise<void>
  allowDropUpload?: boolean

  handleUploadOnDrop?: (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => void
  updateCurrentPath: (
    newPath: string,
    newStoreEntry?: StoreEntryType,
    showLoading?: boolean,
  ) => void
  loadingCurrentPath: boolean
  uploadsInProgress: UploadProgress[]
  showUploadsInTable: boolean

  sourceFiles: IFileConfigured[]
  currentPath: string
  crumbs: Crumb[] | undefined
}
