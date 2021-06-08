import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useToaster, useHistory, useLocation } from "@chainsafe/common-components"
import { getArrayOfPaths, getURISafePathFromArray, getPathWithFile, extractFileBrowserPathFromURL } from "../../../../Utils/pathUtils"
import { IBulkOperations, IFilesTableBrowserProps } from "../types"
import FilesList from "../views/FilesList"
import { CONTENT_TYPES } from "../../../../Utils/Constants"
import { t } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import dayjs from "dayjs"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../../../SurveyBanner"
import { FileBrowserContext } from "../../../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../../../Utils/Helpers"
import { FileSystemItem, useFiles } from "../../../../Contexts/FilesContext"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useUser } from "../../../../Contexts/UserContext"

const ShareFileBrowser = () => {
  const {
    downloadFile,
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
    // TODO fetch contents for bucketId
    const bucketId = moduleRemoved.split("/")[0]
    // TODO: invalid data send back to share
    return extractFileBrowserPathFromURL(pathname, ROUTE_LINKS.ShareExplorer(`${bucketId}/`, "/"))
  },
  [pathname]
  )
  const bucket = useMemo(() => buckets.find(b => b.type === "share"), [buckets])
  const { profile } = useUser()

  const [access, setAccess] = useState<"reader" | "owner" | "writer" | "none">("none")

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
    filesApiClient.getFPSChildList(bucket.id, { path: currentPath })
      .then((newContents) => {
        showLoading && setLoadingCurrentPath(false)

        setPathContents(
          newContents.map((fcr) => parseFileContentResponse(fcr))
        )
      }).catch(error => {
        console.error(error)
      }).finally(() => showLoading && setLoadingCurrentPath(false))
  }, [bucket, filesApiClient, currentPath, profile?.userId])

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

    filesApiClient.moveFPSObject(bucket.id, {
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
        await filesApiClient.moveFPSObject(bucket.id, {
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
    const fileSystemItem = pathContents.find(f => f.cid === cid)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {
      let urlSafePath =  getURISafePathFromArray(getArrayOfPaths(currentPath))
      if (urlSafePath === "/") {
        urlSafePath = ""
      }
      redirect(ROUTE_LINKS.Drive(`${urlSafePath}/${encodeURIComponent(`${fileSystemItem.name}`)}`))
    }
  }, [currentPath, pathContents, redirect])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["move"],
    [CONTENT_TYPES.File]: ["delete", "move"]
  }), [])

  // TODO access control filtering
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
    case "reader":
      return {
        [CONTENT_TYPES.Audio]: ["preview"],
        [CONTENT_TYPES.MP4]: ["preview"],
        [CONTENT_TYPES.Image]: ["preview"],
        [CONTENT_TYPES.Pdf]: ["preview"],
        [CONTENT_TYPES.Text]: ["preview"],
        [CONTENT_TYPES.File]: ["download", "info"],
        [CONTENT_TYPES.Directory]: ["rename"]
      }
    case "none":
      return {
        [CONTENT_TYPES.Audio]: [],
        [CONTENT_TYPES.MP4]: [],
        [CONTENT_TYPES.Image]: [],
        [CONTENT_TYPES.Pdf]: [],
        [CONTENT_TYPES.Text]: [],
        [CONTENT_TYPES.File]: [],
        [CONTENT_TYPES.Directory]: []
      }
    }
  }, [access])


  return (
    <FileBrowserContext.Provider value={{
      bucket,
      bulkOperations,
      crumbs: undefined,
      moduleRootPath: ROUTE_LINKS.Drive("/"),
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
      allowDropUpload: true,
      itemOperations,
      withSurvey: showSurvey && olderThanOneWeek
    }}>
      <FilesList />
    </FileBrowserContext.Provider>
  )
}

export default ShareFileBrowser
