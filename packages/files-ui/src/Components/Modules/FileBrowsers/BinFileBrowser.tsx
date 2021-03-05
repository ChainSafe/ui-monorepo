import React, { useEffect } from "react"
import { FileSystemItem, useDrive } from "../../../Contexts/DriveContext"
import { IFileConfigured, IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"

const BinFileBrowser: React.FC<IFilesBrowserModuleProps> = ({
  heading = "Bin",
  controls = true
}: IFilesBrowserModuleProps) => {
  const {
    deleteFile,
    updateCurrentPath,
    pathContents,
    loadingCurrentPath,
    bucketType,
    recoverFile
  } = useDrive()

  useEffect(() => {
    updateCurrentPath("/", "trash", bucketType !== "trash")
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
          operations: ["recover", "delete"]
        }
      case CONTENT_TYPES.File:
        return {
          ...item,
          operations: ["recover", "delete"]
        }
      case CONTENT_TYPES.Image:
        return {
          ...item,
          operations: ["recover", "delete"]
        }
      case CONTENT_TYPES.Pdf:
        return {
          ...item,
          operations: ["recover", "delete"]
        }
      case CONTENT_TYPES.Text:
        return {
          ...item,
          operations: ["recover", "delete"]
        }
      default:
        return {
          ...item,
          operations: ["recover", "delete"]
        }
      }
    }
  )

  return (
    <DragAndDrop>
      <FilesTableView
        crumbs={undefined}
        recoverFile={handleRecover}
        deleteFile={deleteFile}
        loadingCurrentPath={loadingCurrentPath}
        showUploadsInTable={false}
        sourceFiles={parsedContents}
        updateCurrentPath={updateCurrentPath}
        heading={heading}
        controls={controls}
      />
    </DragAndDrop>
  )
}

export default BinFileBrowser
