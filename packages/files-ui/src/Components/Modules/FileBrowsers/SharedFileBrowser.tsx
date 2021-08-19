import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useToaster, useHistory, useLocation, Crumb } from "@chainsafe/common-components"
import {
  getArrayOfPaths,
  getURISafePathFromArray,
  getPathWithFile,
  extractSharedFileBrowserPathFromURL,
  getUrlSafePathWithFile
} from "../../../Utils/pathUtils"
import { IBulkOperations, IFilesTableBrowserProps } from "./types"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { t } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../../Utils/Helpers"
import { BucketPermission, FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { useUser } from "../../../Contexts/UserContext"
import DragAndDrop from "../../../Contexts/DnDContext"
import FilesList from "./views/FilesList"

const SharedFileBrowser = () => {
  const { downloadFile, uploadFiles, buckets, refreshBuckets, getStorageSummary } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { redirect } = useHistory()
  const { pathname } = useLocation()

  const bucketId = useMemo(() =>
    pathname.split("/")[2]
  , [pathname])

  const bucket = useMemo(() => buckets.find(b => b.id === bucketId), [buckets, bucketId])

  const currentPath = useMemo(() => {
    return extractSharedFileBrowserPathFromURL(pathname, ROUTE_LINKS.SharedFolderExplorer(bucketId, ""))
  },
  [bucketId, pathname])

  const { profile } = useUser()

  const [access, setAccess] = useState<BucketPermission>("reader")

  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath), [currentPath])
  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => {
    return ({
      text: decodeURIComponent(path),
      onClick: () => {
        redirect(
          ROUTE_LINKS.SharedFolderExplorer(bucket?.id || "", getURISafePathFromArray(arrayOfPaths.slice(0, index + 1)))
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
      }).finally(() => {
        getStorageSummary()
        showLoading && setLoadingCurrentPath(false)}
      )
  }, [bucket, getStorageSummary, filesApiClient, currentPath, profile])

  useEffect(() => {
    refreshContents(true)
  }, [bucket, refreshContents])

  const deleteFile = useCallback(async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)

    if (!itemToDelete || !bucket) {
      console.error("Bucket not set or no item found to delete")
      return
    }

    try {
      await filesApiClient.removeBucketObject(
        bucket.id,
        { paths: [getPathWithFile(currentPath, itemToDelete.name)] }
      )

      refreshContents(false)
      refreshBuckets(false)
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
  }, [addToastMessage, bucket, currentPath, pathContents, refreshContents, refreshBuckets, filesApiClient])

  const deleteItems = useCallback(async (cids: string[]) => {
    await Promise.all(
      cids.map((cid: string) =>
        deleteFile(cid)
      ))
  }, [deleteFile])

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
      redirect(ROUTE_LINKS.SharedFolderExplorer(bucket.id, getUrlSafePathWithFile(currentPath, fileSystemItem.name)))
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
      uploadFiles(bucket, files, path)
        .then(() => refreshContents())
        .catch(console.error)
    }
  }, [addToastMessage, uploadFiles, bucket, refreshContents])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["download", "move", "delete"],
    [CONTENT_TYPES.File]: ["download", "delete", "move"]
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
        [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete", "report"],
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
        [CONTENT_TYPES.File]: ["download", "info", "report"],
        [CONTENT_TYPES.Directory]: []
      }
    }
  }, [access])


  return (
    <FileBrowserContext.Provider value={{
      bucket,
      bulkOperations,
      handleUploadOnDrop,
      crumbs,
      moduleRootPath: ROUTE_LINKS.SharedFolderExplorer(bucket?.id || "", "/"),
      currentPath,
      refreshContents,
      deleteItems,
      downloadFile: handleDownload,
      moveItems,
      renameItem,
      viewFolder,
      loadingCurrentPath,
      showUploadsInTable: false,
      sourceFiles: pathContents,
      heading: bucket?.name || t`Shared`,
      controls: true,
      allowDropUpload: access === "writer" || access === "owner",
      itemOperations,
      withSurvey: false
    }}>
      <DragAndDrop>
        <FilesList isShared/>
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default SharedFileBrowser
