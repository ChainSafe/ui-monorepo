import React, { useEffect, useMemo } from "react"
import { useDrive } from "../../../Contexts/DriveContext"
import { IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { IFilesTableBrowserProps } from "../../Modules/FileBrowsers/types"

const BinFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = false }: IFilesBrowserModuleProps) => {
  const {
    updateCurrentPath,
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

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.File]: ["recover", "delete"],
    [CONTENT_TYPES.Directory]: ["recover", "delete"]
  }), [])

  return (
    <DragAndDrop>
      <FilesTableView
        crumbs={undefined}
        recoverFile={handleRecover}
        showUploadsInTable={false}
        updateCurrentPath={updateCurrentPath}
        heading={t`Bin`}
        controls={controls}
        itemOperations={itemOperations}
      />
    </DragAndDrop>
  )
}

export default BinFileBrowser
