import React, { useEffect } from "react"
import { useDrive } from "../../../Contexts/DriveContext"
import { IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"

const BinFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = true }: IFilesBrowserModuleProps) => {
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

  return (
    <DragAndDrop>
      <FilesTableView
        crumbs={undefined}
        recoverFile={handleRecover}
        deleteFile={deleteFile}
        loadingCurrentPath={loadingCurrentPath}
        showUploadsInTable={false}
        sourceFiles={pathContents}
        updateCurrentPath={updateCurrentPath}
        heading={t`Bin`}
        controls={controls}
        itemOperations={{
          "*/*": ["delete", "recover"]
        }}
      />
    </DragAndDrop>
  )
}

export default BinFileBrowser
