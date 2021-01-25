import React from "react"
import { Crumb, useToaster } from "@chainsafe/common-components"
import { IFile, useDrive } from "../../../Contexts/DriveContext"
import { getArrayOfPaths, getPathFromArray } from "../../../Utils/pathUtils"
import { IFileConfigured, IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"

const FileBrowserModule: React.FC<IFilesBrowserModuleProps> = ({
  heading = "My Files",
  controls = true,
  fileOperations,
  folderOperations,
}: IFilesBrowserModuleProps) => {
  const {
    deleteFile,
    downloadFile,
    renameFile,
    moveFile,
    currentPath,
    updateCurrentPath,
    pathContents,
    uploadFiles,
  } = useDrive()

  // Rename
  const handleRename = async (path: string, new_path: string) => {
    // TODO set loading
    await renameFile({
      path: path,
      new_path: new_path,
    })
  }

  // Rename
  const handleMove = async (path: string, new_path: string) => {
    // TODO set loading
    await moveFile({
      path: path,
      new_path: new_path,
    })
  }

  // Breadcrumbs/paths
  const arrayOfPaths = getArrayOfPaths(currentPath)
  const crumbs: Crumb[] = arrayOfPaths.map((path, index) => ({
    text: path,
    onClick: () =>
      updateCurrentPath(getPathFromArray(arrayOfPaths.slice(0, index + 1))),
  }))

  const { addToastMessage } = useToaster()

  const handleUploadOnDrop = (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => {
    let hasFolder = false
    for (let i = 0; i < files.length; i++) {
      if (fileItems[i].webkitGetAsEntry().isDirectory) {
        hasFolder = true
      }
    }
    if (hasFolder) {
      addToastMessage({
        message: "Folder uploads are not supported currently",
        appearance: "error",
      })
    } else {
      uploadFiles(files, path)
    }
  }

  const parsedContents: IFileConfigured[] = pathContents.map(
    (item: IFile): IFileConfigured => {
      switch (item.content_type) {
        case CONTENT_TYPES.Directory:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename"],
          }
        case CONTENT_TYPES.File:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename", "share"],
          }
        case CONTENT_TYPES.Image:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename", "share"],
          }
        case CONTENT_TYPES.Pdf:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename", "share"],
          }
        case CONTENT_TYPES.Text:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename", "share"],
          }
        default:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename", "share"],
          }
      }
    },
  )

  return (
    <FilesTableView
      crumbs={crumbs}
      currentPath={currentPath}
      deleteFile={deleteFile}
      downloadFile={downloadFile}
      fileOperations={fileOperations}
      folderOperations={folderOperations}
      handleMove={handleMove}
      handleRename={handleRename}
      handleUploadOnDrop={handleUploadOnDrop}
      sourceFiles={parsedContents}
      updateCurrentPath={updateCurrentPath}
      heading={heading}
      controls={controls}
    />
  )
}

export default FileBrowserModule
