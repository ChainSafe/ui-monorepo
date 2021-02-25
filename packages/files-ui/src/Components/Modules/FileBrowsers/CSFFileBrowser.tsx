import React, { useEffect } from "react"
import { Crumb, useToaster } from "@chainsafe/common-components"
import { FileSystemItem, useDrive } from "../../../Contexts/DriveContext"
import { getArrayOfPaths, getPathFromArray } from "../../../Utils/pathUtils"
import {
  IBulkOperations,
  IFileConfigured,
  IFilesBrowserModuleProps,
} from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { useQuery } from "../../../Utils/Helpers"

const CSFFileBrowser: React.FC<IFilesBrowserModuleProps> = ({
  heading = "My Files",
  controls = true,
}: IFilesBrowserModuleProps) => {
  const {
    moveFileToTrash,
    bulkMoveFileToTrash,
    downloadFile,
    renameFile,
    moveFile,
    currentPath,
    updateCurrentPath,
    pathContents,
    uploadFiles,
    uploadsInProgress,
    loadingCurrentPath,
    bucketType,
    desktop,
  } = useDrive()

  const queryPath = useQuery().get("path")

  useEffect(() => {
    updateCurrentPath(
      queryPath || "/",
      "csf",
      bucketType !== "csf" || queryPath !== null,
    )
    // eslint-disable-next-line
  }, [queryPath])

  // Rename
  const handleRename = async (path: string, new_path: string) => {
    // TODO set loading
    await renameFile({
      path: path,
      new_path: new_path,
    })
  }
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
      updateCurrentPath(
        getPathFromArray(arrayOfPaths.slice(0, index + 1)),
        undefined,
        true,
      ),
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
    (item: FileSystemItem): IFileConfigured => {
      switch (item.content_type) {
        case CONTENT_TYPES.Directory:
          return {
            ...item,
            operations: ["delete", "download", "move", "rename"],
          }
        case CONTENT_TYPES.File:
          return {
            ...item,
            operations: [
              "delete",
              "info",
              "download",
              "move",
              "rename",
              "share",
              "preview",
            ],
          }
        case CONTENT_TYPES.Image:
          return {
            ...item,
            operations: [
              "delete",
              "info",
              "download",
              "move",
              "rename",
              "share",
              "preview",
            ],
          }
        case CONTENT_TYPES.Pdf:
          return {
            ...item,
            operations: [
              "delete",
              "info",
              "download",
              "move",
              "rename",
              "share",
              "preview",
            ],
          }
        case CONTENT_TYPES.Text:
          return {
            ...item,
            operations: [
              "delete",
              "info",
              "download",
              "move",
              "rename",
              "share",
              "preview",
            ],
          }
        default:
          return {
            ...item,
            operations: [
              "delete",
              "info",
              "download",
              "move",
              "rename",
              "share",
              "preview",
            ],
          }
      }
    },
  )

  const bulkOperations: IBulkOperations = {
    [CONTENT_TYPES.Directory]: ["move"],
    [CONTENT_TYPES.File]: ["delete", "move"],
  }

  return (
    <DragAndDrop>
      <FilesTableView
        bulkOperations={bulkOperations}
        crumbs={crumbs}
        currentPath={currentPath}
        deleteFile={moveFileToTrash}
        bulkMoveFileToTrash={bulkMoveFileToTrash}
        downloadFile={downloadFile}
        handleMove={handleMove}
        handleRename={handleRename}
        handleUploadOnDrop={handleUploadOnDrop}
        uploadsInProgress={uploadsInProgress}
        loadingCurrentPath={loadingCurrentPath}
        showUploadsInTable={true}
        sourceFiles={parsedContents}
        updateCurrentPath={updateCurrentPath}
        heading={heading}
        controls={controls}
        allowDropUpload={true}
        desktop={desktop}
      />
    </DragAndDrop>
  )
}

export default CSFFileBrowser
