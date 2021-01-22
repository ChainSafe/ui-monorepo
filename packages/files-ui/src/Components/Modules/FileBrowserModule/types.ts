import { Crumb } from "@chainsafe/common-components"
import { IFile } from "../../../Contexts/DriveContext"

export type FileOperation = "rename" | "delete" | "download" | "share" | "move"

export interface IFilesBrowserModuleProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
  fileOperations: FileOperation[]
  folderOperations: FileOperation[]
}

export interface IFilesTableBrowserProps extends IFilesBrowserModuleProps {
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

  sourceFiles: IFile[]
  currentPath: string
  crumbs: Crumb[]
}
