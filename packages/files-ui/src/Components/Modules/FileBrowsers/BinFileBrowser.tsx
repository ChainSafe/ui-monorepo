import React, { useEffect } from "react"
import { FileSystemItem, useDrive } from "../../../Contexts/DriveContext"
import { IFileConfigured, IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"

const BinFileBrowser: React.FC<IFilesBrowserModuleProps> = ({
  heading = "Bin",
  controls = true,
}: IFilesBrowserModuleProps) => {
  const {
    deleteFile,
    currentPath,
    updateCurrentPath,
    pathContents,
    loadingCurrentPath,
    storeEntry,
    recoverFile,
    desktop,
  } = useDrive()

  useEffect(() => {
    updateCurrentPath("/", "trash", storeEntry !== "trash")
    // eslint-disable-next-line
  }, [])

  const handleRecover = async (cid: string) => {
    // TODO set loading
    try {
      await recoverFile(cid)
    } catch {
      //
    }
  }

  const parsedContents: IFileConfigured[] = pathContents.map(
    (item: FileSystemItem): IFileConfigured => {
      switch (item.content_type) {
        case CONTENT_TYPES.Directory:
          return {
            ...item,
            operations: ["recover", "delete"],
          }
        case CONTENT_TYPES.File:
          return {
            ...item,
            operations: ["recover", "delete"],
          }
        case CONTENT_TYPES.Image:
          return {
            ...item,
            operations: ["recover", "delete"],
          }
        case CONTENT_TYPES.Pdf:
          return {
            ...item,
            operations: ["recover", "delete"],
          }
        case CONTENT_TYPES.Text:
          return {
            ...item,
            operations: ["recover", "delete"],
          }
        default:
          return {
            ...item,
            operations: ["recover", "delete"],
          }
      }
    },
  )

  return (
    <DragAndDrop>
      <FilesTableView
        crumbs={undefined}
        currentPath={currentPath}
        recoverFile={handleRecover}
        deleteFile={deleteFile}
        uploadsInProgress={[]}
        loadingCurrentPath={loadingCurrentPath}
        showUploadsInTable={true}
        sourceFiles={parsedContents}
        updateCurrentPath={updateCurrentPath}
        heading={heading}
        controls={controls}
        desktop={desktop}
      />
    </DragAndDrop>
  )
}

export default BinFileBrowser
