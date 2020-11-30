export type FileOperation = "rename" | "delete" | "download" | "share" | "move"

export interface IFileBrowserProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
  fileOperations: FileOperation[]
  folderOperations: FileOperation[]
}
