import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Crumb, useToaster, useHistory, useParams } from "@chainsafe/common-components"
import { useDrive, FileSystemItem, BucketType } from "../../../Contexts/DriveContext"
import { getArrayOfPaths, getPathFromArray, getPathWithFile } from "../../../Utils/pathUtils"
import { IBulkOperations, IFilesBrowserModuleProps, IFilesTableBrowserProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { guessContentType } from "../../../Utils/contentTypeGuesser"
import { ROUTE_LINKS } from "../../FilesRoutes"

const CSFFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = true }: IFilesBrowserModuleProps) => {
  const {
    downloadFile,
    renameFile,
    moveFile,
    uploadFiles,
    moveCSFObject,
    uploadsInProgress,
    list
  } = useDrive()
  const { addToastMessage } = useToaster()

  // const { currentPath } = useParams<{ currentPath: string }>()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const [bucketType] = useState<BucketType>("csf")

  const { redirect } = useHistory()

  const { rawCurrentPath } = useParams<{ rawCurrentPath: string }>()
  console.log("rawCurrentPath", rawCurrentPath)

  const [currentPath, setCurrentPath] = useState(rawCurrentPath ? decodeURI(rawCurrentPath) : "/")
  const refreshContents = useCallback(
    async (
      path: string,
      bucketTypeParam?: BucketType,
      showLoading?: boolean
    ) => {
      try {
        showLoading && setLoadingCurrentPath(true)
        const newContents = await list({
          path,
          source: {
            type: bucketTypeParam || bucketType
          }
        })
        showLoading && setLoadingCurrentPath(false)

        if (newContents) {
          // Remove this when the API returns dates
          setPathContents(
            newContents?.map((fcr) => ({
              ...fcr,
              content_type:
                fcr.content_type !== "application/octet-stream"
                  ? fcr.content_type
                  : guessContentType(fcr.name),
              isFolder:
                fcr.content_type === "application/chainsafe-files-directory"
            }))
          )
        }
      } catch (error) {
        showLoading && setLoadingCurrentPath(false)
      }
    },
    [bucketType, list]
  )

  useEffect(() => {
    console.log("refreshing")
    setCurrentPath(rawCurrentPath ? decodeURI(rawCurrentPath) : "/")
    refreshContents(rawCurrentPath ? decodeURI(rawCurrentPath) : "/")
  }, [refreshContents, rawCurrentPath])

  // From drive
  const moveFileToTrash = useCallback(async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)

    if (!itemToDelete) {
      console.error("No item found to move to the trash")
      return
    }

    try {
      await moveCSFObject({
        path: getPathWithFile(currentPath, itemToDelete.name),
        new_path: getPathWithFile("/", itemToDelete.name),
        destination: {
          type: "trash"
        }
      })
      await refreshContents(currentPath)
      const message = `${
        itemToDelete.isFolder ? t`Folder` : t`File`
      } ${t`deleted successfully`}`
      addToastMessage({
        message: message,
        appearance: "success"
      })
      return Promise.resolve()
    } catch (error) {
      const message = `${t`There was an error deleting this`} ${
        itemToDelete.isFolder ? t`folder` : t`file`
      }`
      addToastMessage({
        message: message,
        appearance: "error"
      })
      return Promise.reject()
    }
  }, [addToastMessage, currentPath, pathContents, refreshContents, moveCSFObject])

  const moveFilesToTrash = useCallback(async (cids: string[]) => {
    return Promise.all(
      cids.map((cid: string) =>
        moveFileToTrash(cid)
      ))
  }, [moveFileToTrash])
  // END

  // Rename
  const handleRename = useCallback(async (path: string, newPath: string) => {
    // TODO set loading
    await renameFile({ path: path, new_path: newPath })
    await refreshContents(currentPath)
  }, [renameFile, currentPath, refreshContents])

  const handleMove = useCallback(async (path: string, new_path: string) => {
    // TODO set loading
    await moveFile({
      path: path,
      new_path: new_path
    })
    await refreshContents(currentPath)
  }, [moveFile, refreshContents, currentPath])

  const handleDownload = useCallback(async (cid: string) => {
    const target = pathContents.find(item => item.cid === cid)
    if (!target) return

    await downloadFile(target, currentPath, bucketType)
  }, [pathContents, downloadFile, currentPath, bucketType])


  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath), [currentPath])
  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => ({
    text: path,
    onClick: () =>
      redirect(
        ROUTE_LINKS.Drive(encodeURI(encodeURI(getPathFromArray(arrayOfPaths.slice(0, index + 1)))))
      )
  })), [arrayOfPaths, redirect])


  const handleUploadOnDrop = useCallback(async (files: File[], fileItems: DataTransferItemList, path: string) => {
    let hasFolder = false
    for (let i = 0; i < files.length; i++) {
      if (fileItems[i].webkitGetAsEntry().isDirectory) {
        hasFolder = true
      }
    }
    if (hasFolder) {
      addToastMessage({
        message: "Folder uploads are not supported currently",
        appearance: "error"
      })
    } else {
      await uploadFiles(files, path)
      // refresh contents
      // using reducer because user may navigate to other paths
      // need to check currentPath and upload path is same
      refreshContents(currentPath)
    }
  }, [addToastMessage, uploadFiles, currentPath, refreshContents])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["move"],
    [CONTENT_TYPES.File]: ["delete", "move"]
  }), [])

  const ItemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.Audio]: ["preview"],
    [CONTENT_TYPES.MP4]: ["preview"],
    [CONTENT_TYPES.Image]: ["preview"],
    [CONTENT_TYPES.Pdf]: ["preview"],
    [CONTENT_TYPES.Text]: ["preview"],
    [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete"],
    [CONTENT_TYPES.Directory]: ["rename", "move", "delete"]
  }), [])

  return (
    <DragAndDrop>
      <FilesTableView
        bulkOperations={bulkOperations}
        crumbs={crumbs}
        moduleRootPath={ROUTE_LINKS.Drive("")}
        currentPath={currentPath}
        refreshContents={() => refreshContents(currentPath)}
        deleteFiles={moveFilesToTrash}
        downloadFile={handleDownload}
        handleMove={handleMove}
        handleRename={handleRename}
        handleUploadOnDrop={handleUploadOnDrop}
        uploadsInProgress={uploadsInProgress}
        loadingCurrentPath={loadingCurrentPath}
        showUploadsInTable={true}
        sourceFiles={pathContents}
        heading = {t`My Files`}
        bucketType={bucketType}
        controls={controls}
        allowDropUpload={true}
        itemOperations={ItemOperations}
      />
    </DragAndDrop>
  )
}

export default CSFFileBrowser
