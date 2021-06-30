import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useToaster, useHistory, useLocation, Crumb } from "@chainsafe/common-components"
import { getArrayOfPaths, getURISafePathFromArray, getPathWithFile, extractFileBrowserPathFromURL } from "../../../../Utils/pathUtils"
import { IBulkOperations, IFilesTableBrowserProps } from "../types"
import { CONTENT_TYPES } from "../../../../Utils/Constants"
import { t } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import dayjs from "dayjs"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../../../SurveyBanner"
import { FileBrowserContext } from "../../../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../../../Utils/Helpers"
import { BucketPermission, FileSystemItem, useFiles } from "../../../../Contexts/FilesContext"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useUser } from "../../../../Contexts/UserContext"
import DragAndDrop from "../../../../Contexts/DnDContext"
import SharesList from "../views/SharesList"

const ShareFileBrowser = () => {
  const {
    downloadFile,
    uploadFiles,
    buckets
  } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { redirect } = useHistory()
  const { pathname } = useLocation()

  const currentPath = useMemo(() => {
    const moduleRemoved = extractFileBrowserPathFromURL(pathname, ROUTE_LINKS.ShareExplorer("", "/"))
    const bucketId = moduleRemoved.split("/")[0]
    return extractFileBrowserPathFromURL(pathname, ROUTE_LINKS.ShareExplorer(`${bucketId}/`, "/"))
  },
  [pathname])

  const bucket = useMemo(() => buckets.find(b => b.type === "share"), [buckets])
  const { profile } = useUser()

  const [access, setAccess] = useState<BucketPermission>("reader")

  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath).splice(2), [currentPath])
  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => {
    return ({
      text: decodeURIComponent(path),
      onClick: () => {
        redirect(
          ROUTE_LINKS.ShareExplorer(`${bucket?.id}`, getURISafePathFromArray(arrayOfPaths.slice(0, index + 1)))
        )
      }
    })
  }), [arrayOfPaths, bucket, redirect])

  const refreshContents = useCallback((showLoading?: boolean) => {
    if (!bucket) return
    // Water fall to reduce map calls
    const isOwner = !!(bucket.owners.find(owner => owner.uuid === profile?.userId))
    if (isOwner) {
      setAccess("owner")
    } else {
      const isWriter = !!(bucket.writers.find(owner => owner.uuid === profile?.userId))
      if (isWriter) {
        setAccess("writer")
      } else {
        const isReader = !!(bucket.readers.find(owner => owner.uuid === profile?.userId))
        if (isReader) {
          setAccess("reader")
        }
      }
    }

    showLoading && setLoadingCurrentPath(true)
    filesApiClient.getBucketObjectChildrenList(bucket.id, { path: currentPath })
      .then((newContents) => {
        showLoading && setLoadingCurrentPath(false)

        setPathContents(
          newContents.map((fcr) => parseFileContentResponse(fcr))
        )
      }).catch(error => {
        console.error(error)
      }).finally(() => showLoading && setLoadingCurrentPath(false))
  }, [bucket, filesApiClient, currentPath, profile])

  const { localStorageGet, localStorageSet } = useLocalStorage()

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
          await filesApiClient.moveBucketObjects(bucket.id, {
            path: getPathWithFile(currentPath, itemToDelete.name),
            new_path: getPathWithFile("/", itemToDelete.name),
            destination: buckets.find(b => b.type === "trash")?.id
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
  }, [addToastMessage, buckets, currentPath, pathContents, refreshContents, filesApiClient, bucket])

  // Rename
  const renameItem = useCallback(async (cid: string, newName: string) => {
    const itemToRename = pathContents.find(i => i.cid === cid)
    if (!bucket || !itemToRename) return

    filesApiClient.moveBucketObjects(bucket.id, {
      path: getPathWithFile(currentPath, itemToRename.name),
      new_path: getPathWithFile(currentPath, newName) }).then(() => refreshContents())
      .catch(console.error)
  }, [refreshContents, filesApiClient, bucket, currentPath, pathContents])

  const moveItems = useCallback(async (cids: string[], newPath: string) => {
    if (!bucket) return
    await Promise.all(
      cids.map(async (cid: string) => {
        const itemToMove = pathContents.find(i => i.cid === cid)
        if (!bucket || !itemToMove) return
        await filesApiClient.moveBucketObjects(bucket.id, {
          path: getPathWithFile(currentPath, itemToMove.name),
          new_path: getPathWithFile(newPath, itemToMove.name)
        })
      })).finally(refreshContents)
  }, [refreshContents, filesApiClient, bucket, currentPath, pathContents])

  const handleDownload = useCallback(async (cid: string) => {
    const itemToDownload = pathContents.find(item => item.cid === cid)
    if (!itemToDownload || !bucket) return

    downloadFile(bucket.id, itemToDownload, currentPath)
  }, [pathContents, downloadFile, currentPath, bucket])

  const viewFolder = useCallback((cid: string) => {
    if (!bucket) return

    const fileSystemItem = pathContents.find(f => f.cid === cid)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {
      let urlSafePath =  getURISafePathFromArray(getArrayOfPaths(currentPath).splice(2))
      if (urlSafePath === "/") {
        urlSafePath = ""
      }
      redirect(ROUTE_LINKS.ShareExplorer(bucket.id, `${urlSafePath}/${encodeURIComponent(`${fileSystemItem.name}`)}`))
    }
  }, [currentPath, pathContents, redirect, bucket])

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
      uploadFiles(bucket.id, files, path)
        .then(() => refreshContents())
        .catch(console.error)
    }
  }, [addToastMessage, uploadFiles, bucket, refreshContents])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["move"],
    [CONTENT_TYPES.File]: ["delete", "move"]
  }), [])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => {
    switch (access) {
    case "owner":
      return {
        [CONTENT_TYPES.Audio]: ["preview"],
        [CONTENT_TYPES.MP4]: ["preview"],
        [CONTENT_TYPES.Image]: ["preview"],
        [CONTENT_TYPES.Pdf]: ["preview"],
        [CONTENT_TYPES.Text]: ["preview"],
        [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete"],
        [CONTENT_TYPES.Directory]: ["rename", "move", "delete"]
      }
    case "writer":
      return {
        [CONTENT_TYPES.Audio]: ["preview"],
        [CONTENT_TYPES.MP4]: ["preview"],
        [CONTENT_TYPES.Image]: ["preview"],
        [CONTENT_TYPES.Pdf]: ["preview"],
        [CONTENT_TYPES.Text]: ["preview"],
        [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete"],
        [CONTENT_TYPES.Directory]: ["rename", "move", "delete"]
      }
    // case "reader":
    default:
      return {
        [CONTENT_TYPES.Audio]: ["preview"],
        [CONTENT_TYPES.MP4]: ["preview"],
        [CONTENT_TYPES.Image]: ["preview"],
        [CONTENT_TYPES.Pdf]: ["preview"],
        [CONTENT_TYPES.Text]: ["preview"],
        [CONTENT_TYPES.File]: ["download", "info"],
        [CONTENT_TYPES.Directory]: ["rename"]
      }
    }
  }, [access])


  return (
    <FileBrowserContext.Provider value={{
      bucket,
      accessRole: access,
      bulkOperations,
      handleUploadOnDrop,
      crumbs,
      moduleRootPath: ROUTE_LINKS.ShareExplorer(`${bucket?.id}`, "/"),
      currentPath,
      refreshContents,
      deleteItems: moveItemsToBin,
      downloadFile: handleDownload,
      moveItems,
      renameItem: renameItem,
      viewFolder,
      loadingCurrentPath,
      showUploadsInTable: false,
      sourceFiles: pathContents,
      heading: t`Shared`,
      controls: true,
      allowDropUpload: access === "writer" || access === "owner",
      itemOperations,
      withSurvey: showSurvey && olderThanOneWeek
    }}>
      <DragAndDrop>
        <SharesList />
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default ShareFileBrowser
