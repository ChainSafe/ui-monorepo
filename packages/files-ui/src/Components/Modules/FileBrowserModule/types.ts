import { Crumb } from "@chainsafe/common-components"
import { FileSystemItem } from "../../../Contexts/DriveContext"
import { CONTENT_TYPES } from "../../../Utils/Constants"

export type FileOperation =
  | "rename"
  | "delete"
  | "download"
  | "share"
  | "move"
  | "info"
  | "preview"

export interface IFilesBrowserModuleProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
  fileOperations: FileOperation[]
  folderOperations: FileOperation[]
}

export interface IFileConfigured extends FileSystemItem {
  operations: FileOperation[]
}

export interface IFilesTableBrowserProps
  extends Omit<
    IFilesBrowserModuleProps,
    "fileOperations" | "folderOperations"
  > {
  handleRename: (path: string, new_path: string) => Promise<void>
  handleMove: (path: string, new_path: string) => Promise<void>
  downloadFile: (cid: string) => Promise<void>
  deleteFile: (cid: string) => Promise<void>

  handleUploadOnDrop: (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => void
  updateCurrentPath: (newPath: string) => void

  sourceFiles: IFileConfigured[]
  currentPath: string
  crumbs: Crumb[]
  bulkOperations?: IBulkOperations
}

export interface IBulkOperations {
  [index: string]: FileOperation[]
}
