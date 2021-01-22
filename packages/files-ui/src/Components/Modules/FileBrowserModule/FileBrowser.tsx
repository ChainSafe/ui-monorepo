import React from "react"
import { Crumb, useToaster } from "@chainsafe/common-components"
import { useState } from "react"
import { useDrive } from "../../../Contexts/DriveContext"
import { getArrayOfPaths, getPathFromArray } from "../../../Utils/pathUtils"
import { IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"

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
  const [, setEditing] = useState<string | undefined>()

  // Rename
  const handleRename = async (path: string, new_path: string) => {
    // TODO set loading
    await renameFile({
      path: path,
      new_path: new_path,
    })
    setEditing(undefined)
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

  // Modals

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
      sourceFiles={pathContents}
      updateCurrentPath={updateCurrentPath}
      heading={heading}
      controls={controls}
    />
  )
}

export default FileBrowserModule
