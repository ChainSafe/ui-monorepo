import React, { useCallback, useEffect, useMemo } from "react"
import { Crumb, useHistory, useToaster } from "@chainsafe/common-components"
import { useDrive } from "../../../Contexts/DriveContext"
import { getArrayOfPaths, getPathFromArray } from "../../../Utils/pathUtils"
import { IBulkOperations, IFilesBrowserModuleProps, IFilesTableBrowserProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { useQuery } from "../../../Utils/Helpers"
import { t } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../../SurveyBanner"
import { useUser } from "@chainsafe/common-contexts"
import dayjs from "dayjs"

const CSFFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = true }: IFilesBrowserModuleProps) => {
  const {
    moveFilesToTrash,
    downloadFile,
    renameFile,
    moveFile,
    currentPath,
    updateCurrentPath,
    pathContents,
    uploadFiles,
    uploadsInProgress,
    loadingCurrentPath,
    bucketType
  } = useDrive()

  const queryPath = useQuery().get("path")
  const { redirect } = useHistory()
  const { localStorageGet } = useLocalStorage()
  const { profile } = useUser()
  const hasDismissedSurvey = localStorageGet(DISMISSED_SURVEY_KEY) === "true"
  const olderThanOneWeek = useMemo(
    () => profile?.createdAt
      ? dayjs(Date.now()).diff(profile.createdAt, "day") > 7
      : false
    , [profile?.createdAt]
  )

  useEffect(() => {
    updateCurrentPath(
      queryPath || "/",
      "csf",
      bucketType !== "csf" || queryPath !== null
    )
    // eslint-disable-next-line
  }, [queryPath])

  // Rename
  const handleRename = useCallback(async (path: string, newPath: string) => {
    // TODO set loading
    await renameFile({ path: path, new_path: newPath })
  }, [renameFile])

  const handleMove = useCallback(async (path: string, new_path: string) => {
    // TODO set loading
    await moveFile({
      path: path,
      new_path: new_path
    })
  }, [moveFile])

  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath), [currentPath])
  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => ({
    text: path,
    onClick: () =>
      updateCurrentPath(
        getPathFromArray(arrayOfPaths.slice(0, index + 1)),
        undefined,
        true
      )
  })), [arrayOfPaths, updateCurrentPath])

  const { addToastMessage } = useToaster()

  const handleUploadOnDrop = useCallback((files: File[], fileItems: DataTransferItemList, path: string) => {
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
      uploadFiles(files, path)
    }
  }, [addToastMessage, uploadFiles])

  const viewFolder = useCallback((cid: string) => {
    const fileSystemItem = pathContents.find(f => f.cid === cid)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {
      redirect(ROUTE_LINKS.Home(`${currentPath}${fileSystemItem.name}`))
    }
  }, [currentPath, pathContents, redirect])

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
        currentPath={currentPath}
        deleteFiles={moveFilesToTrash}
        downloadFile={downloadFile}
        handleMove={handleMove}
        handleRename={handleRename}
        viewFolder={viewFolder}
        handleUploadOnDrop={handleUploadOnDrop}
        uploadsInProgress={uploadsInProgress}
        loadingCurrentPath={loadingCurrentPath}
        showUploadsInTable={true}
        sourceFiles={pathContents}
        updateCurrentPath={updateCurrentPath}
        heading = {t`My Files`}
        controls={controls}
        allowDropUpload={true}
        itemOperations={ItemOperations}
        withSurvey={!hasDismissedSurvey && olderThanOneWeek}
      />
    </DragAndDrop>
  )
}

export default CSFFileBrowser
