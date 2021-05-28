import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Crumb, useToaster, useHistory, useLocation } from "@chainsafe/common-components"
import { useFiles, FileSystemItem } from "../../../Contexts/FilesContext"
import { extractDrivePath, getArrayOfPaths, getURISafePathFromArray, getPathWithFile } from "../../../Utils/pathUtils"
import { IBulkOperations, IFilesTableBrowserProps } from "./types"
import FilesList from "./views/FilesList"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"
import dayjs from "dayjs"
import { useUser, useFilesApi } from "@chainsafe/common-contexts"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../../SurveyBanner"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../../Utils/Helpers"

const SharedFolderOverview = () => {
  const { downloadFile, uploadFiles, uploadsInProgress, buckets } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { redirect } = useHistory()

  const { pathname } = useLocation()
  const [currentPath, setCurrentPath] = useState(extractDrivePath(pathname.split("/").slice(1).join("/")))

  const bucketsToShow = useMemo(() => buckets.find(b => b.type === "share"), [buckets])

  // const refreshContents = useCallback((showLoading?: boolean) => {
  // if (!bucketsToShow) return
  // showLoading && setLoadingCurrentPath(true)
  // filesApiClient.getFPSChildList(bucket.id, { path: currentPath })
  //   .then((newContents) => {
  //     showLoading && setLoadingCurrentPath(false)

  //     setPathContents(
  //       newContents.map((fcr) => parseFileContentResponse(fcr))
  //     )
  //   }).catch(error => {
  //     console.error(error)
  //   }).finally(() => showLoading && setLoadingCurrentPath(false))
  // }, [bucket, filesApiClient, currentPath])

  const { localStorageGet, localStorageSet } = useLocalStorage()
  const { profile } = useUser()

  const showSurvey = localStorageGet(DISMISSED_SURVEY_KEY) === "false"

  const olderThanOneWeek = useMemo(
    () => profile?.createdAt
      ? dayjs(Date.now()).diff(profile.createdAt, "day") > 7
      : false
    , [profile]
  )

  useEffect(() => {
    const dismissedFlag = localStorageGet(DISMISSED_SURVEY_KEY)
    if (dismissedFlag === undefined || dismissedFlag === null) {
      localStorageSet(DISMISSED_SURVEY_KEY, "false")
    }
  }, [localStorageGet, localStorageSet])

  useEffect(() => {
    refreshContents(true)
  }, [bucket, refreshContents])

  useEffect(() => {
    let drivePath = extractDrivePath(pathname)
    if (drivePath[0] !== "/") {
      drivePath = "/" + drivePath
    }
    if (drivePath !== currentPath) {
      if (drivePath === "/") {
        setCurrentPath(drivePath)
      } else {
        setCurrentPath(decodeURIComponent(drivePath.slice(0, -1)))
      }

      refreshContents(true)
    }
  }, [refreshContents, pathname, currentPath])

  const moveItemsToBin = useCallback(async (cids: string[]) => {
    if (!bucket) return
    await Promise.all(
      cids.map(async (cid: string) => {
        const itemToDelete = pathContents.find((i) => i.cid === cid)
        if (!itemToDelete) {
          console.error("No item found to move to the trash")
          return
        }

        try {
          await filesApiClient.moveFPSObject(bucket.id, {
            path: getPathWithFile(currentPath, itemToDelete.name),
            new_path: getPathWithFile("/", itemToDelete.name),
            destination: {
              type: "trash"
            }
          })
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
        }}
      )).finally(refreshContents)
  }, [addToastMessage, currentPath, pathContents, refreshContents, filesApiClient, bucket])

  // Rename
  const renameItem = useCallback(async (cid: string, newName: string) => {
    const itemToRename = pathContents.find(i => i.cid === cid)
    if (!bucket || !itemToRename) return

    await filesApiClient.moveFPSObject(bucket.id, {
      path: getPathWithFile(currentPath, itemToRename.name),
      new_path: getPathWithFile(currentPath, newName) })
    await refreshContents()
  }, [refreshContents, filesApiClient, bucket, currentPath, pathContents])

  const moveItems = useCallback(async (cids: string[], newPath: string) => {
    if (!bucket) return
    await Promise.all(
      cids.map(async (cid: string) => {
        const itemToMove = pathContents.find(i => i.cid === cid)
        if (!bucket || !itemToMove) return
        await filesApiClient.moveFPSObject(bucket.id, {
          path: getPathWithFile(currentPath, itemToMove.name),
          new_path: getPathWithFile(newPath, itemToMove.name)
        })
      })).finally(refreshContents)
  }, [refreshContents, filesApiClient, bucket, currentPath, pathContents])

  const handleDownload = useCallback(async (cid: string) => {
    const itemToDownload = pathContents.find(item => item.cid === cid)
    if (!itemToDownload || !bucket) return

    await downloadFile(bucket.id, itemToDownload, currentPath)
  }, [pathContents, downloadFile, currentPath, bucket])

  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath), [currentPath])
  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => ({
    text: decodeURIComponent(path),
    onClick: () => {

      redirect(
        ROUTE_LINKS.Drive(getURISafePathFromArray(arrayOfPaths.slice(0, index + 1)))
      )
    }
  })), [arrayOfPaths, redirect])


  const handleUploadOnDrop = useCallback(async (files: File[], fileItems: DataTransferItemList, path: string) => {
    if (!bucket) return
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
      await uploadFiles(bucket.id, files, path)
      refreshContents()
    }
  }, [addToastMessage, uploadFiles, bucket, refreshContents])

  const viewFolder = useCallback((cid: string) => {
    const fileSystemItem = pathContents.find(f => f.cid === cid)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {
      let urlSafePath
      if (currentPath !== "/") {
        urlSafePath = `/${currentPath.slice(1).split("/").map(encodeURIComponent).join("/")}`
      } else {
        urlSafePath = ""
      }
      redirect(ROUTE_LINKS.Drive(`${urlSafePath}/${encodeURIComponent(`${fileSystemItem.name}`)}`))
    }
  }, [currentPath, pathContents, redirect])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["move"],
    [CONTENT_TYPES.File]: ["delete", "move"]
  }), [])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.Audio]: ["preview"],
    [CONTENT_TYPES.MP4]: ["preview"],
    [CONTENT_TYPES.Image]: ["preview"],
    [CONTENT_TYPES.Pdf]: ["preview"],
    [CONTENT_TYPES.Text]: ["preview"],
    [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete"],
    [CONTENT_TYPES.Directory]: ["rename", "move", "delete"]
  }), [])

  return (
    <FileBrowserContext.Provider value={{
      bucket: bucket,
      bulkOperations,
      crumbs,
      moduleRootPath: ROUTE_LINKS.Drive(""),
      currentPath,
      refreshContents,
      deleteItems: moveItemsToBin,
      downloadFile: handleDownload,
      moveItems,
      renameItem: renameItem,
      viewFolder,
      handleUploadOnDrop,
      uploadsInProgress,
      loadingCurrentPath,
      showUploadsInTable: true,
      sourceFiles: pathContents,
      heading: t`My Files`,
      controls: true,
      allowDropUpload: true,
      itemOperations,
      withSurvey: showSurvey && olderThanOneWeek
    }}>
      <DragAndDrop>
        <FilesList />
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default SharedFolderOverview
