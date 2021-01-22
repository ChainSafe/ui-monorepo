import { ITheme, useMediaQuery, useTheme } from "@chainsafe/common-theme"
import React, { Fragment } from "react"
import {
  Divider,
  MenuDropdown,
  PlusIcon,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Typography,
  Breadcrumb,
  Crumb,
  CircularProgressBar,
  useToaster,
  Button,
  PlusCircleIcon,
  UploadIcon,
  Dialog,
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import { useDrive, IFile } from "../../../Contexts/DriveContext"
import { object, string } from "yup"
import EmptySvg from "../../../Media/Empty.svg"
import CreateFolderModule from "../CreateFolderModule"
import UploadFileModule from "../UploadFileModule"
import FilePreviewModal from "../FilePreviewModal"
import { getArrayOfPaths, getPathFromArray } from "../../../Utils/pathUtils"
import UploadProgressModals from "../UploadProgressModals"
import clsx from "clsx"
import { t, Trans } from "@lingui/macro"
import FileOrFolderView from "./FileOrFolderView"
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import DownloadProgressModals from "../DownloadProgressModals"
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
    uploadsInProgress,
    uploadFiles,
  } = useDrive()
  const [editing, setEditing] = useState<string | undefined>()
  const [direction, setDirection] = useState<SortDirection>("descend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">(
    "name",
  )
  const [selected, setSelected] = useState<string[]>([])

  const [previewFileIndex, setPreviewFileIndex] = useState<number | undefined>(
    undefined,
  )

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
