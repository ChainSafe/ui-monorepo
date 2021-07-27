import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Crumb, useToaster, useHistory, useLocation } from "@chainsafe/common-components"
import { useStorage, FileSystemItem } from "../../Contexts/StorageContext"
import {
  getArrayOfPaths,
  getURISafePathFromArray,
  getPathWithFile,
  extractFileBrowserPathFromURL,
  getUrlSafePathWithFile
} from "../../Utils/pathUtils"
import { IBulkOperations, IFileBrowserModuleProps, IFilesTableBrowserProps } from "../../Contexts/types"
import FilesList from "../Modules/FilesList/FilesList"
import { CONTENT_TYPES } from "../../Utils/Constants"
import DragAndDrop from "../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { ROUTE_LINKS } from "../../Components/StorageRoutes"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { FileBrowserContext, ISelectedFile } from "../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../Utils/Helpers"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../Modules/SurveyBanner"

const BucketPage: React.FC<IFileBrowserModuleProps> = () => {
  const { storageBuckets, uploadFiles, uploadsInProgress, getStorageSummary } = useStorage()
  const { storageApiClient } = useStorageApi()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { redirect } = useHistory()
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const showSurvey = localStorageGet(DISMISSED_SURVEY_KEY) === "false"
  const { pathname } = useLocation()

  const bucketId = useMemo(() =>
    pathname.split("/")[2]
  , [pathname])

  useEffect(() => {
    const dismissedFlag = localStorageGet(DISMISSED_SURVEY_KEY)

    if (dismissedFlag === undefined || dismissedFlag === null) {
      localStorageSet(DISMISSED_SURVEY_KEY, "false")
    }
  }, [localStorageGet, localStorageSet])

  const currentPath = useMemo(() => {
    return extractFileBrowserPathFromURL(pathname, ROUTE_LINKS.Bucket(bucketId, "/"))
  }, [pathname, bucketId])
  const bucket = useMemo(() => storageBuckets.find(b => b.id === bucketId), [storageBuckets, bucketId])

  const refreshContents = useCallback((showLoading?: boolean) => {
    if (!bucket) return
    showLoading && setLoadingCurrentPath(true)
    storageApiClient.getBucketObjectChildrenList(bucket.id, { path: currentPath })
      .then((newContents) => {
        showLoading && setLoadingCurrentPath(false)

        setPathContents(
          newContents.map((fcr) => parseFileContentResponse(fcr))
        )
      }).catch(error => {
        console.error(error)
      }).finally(() =>  {
        getStorageSummary()
        showLoading && setLoadingCurrentPath(false)
      })
  }, [bucket, storageApiClient, currentPath, getStorageSummary])

  useEffect(() => {
    refreshContents(true)
  }, [bucket, refreshContents])


  const deleteItems = useCallback((toDelete: ISelectedFile[]) => {
    if (!bucket) throw new Error("no bucket found")

    const itemsToDelete = toDelete.map((item) => pathContents.find((i) => i.cid === item.cid && i.name === item.name))
    return storageApiClient.removeBucketObject(bucket.id, {
      paths: itemsToDelete.map((item) => (getPathWithFile(currentPath, item?.name)))
    }).then(() => {
      addToastMessage({
        message: t`Deletion successful`,
        appearance: "success"
      })
    })
      .catch((e) => {
        console.error(e)
        const message = t`There was an error deleting this item`
        addToastMessage({
          message: message,
          appearance: "error"
        })
      })
      .finally(refreshContents)
  }, [bucket, storageApiClient, refreshContents, pathContents, currentPath, addToastMessage])

  const renameItem = useCallback(async (toRename: ISelectedFile, newName: string) => {
    const itemToRename = pathContents.find(i => i.cid === toRename.cid && i.name === toRename.name)
    if (!bucket || !itemToRename) return

    storageApiClient.moveBucketObjects(bucket.id, {
      path: getPathWithFile(currentPath, itemToRename.name),
      new_path: getPathWithFile(currentPath, newName) })
      .then(() => refreshContents())
      .catch(console.error)
  }, [refreshContents, storageApiClient, bucket, currentPath, pathContents])

  const moveItems = useCallback(async (toMove: ISelectedFile[], newPath: string) => {
    if (!bucket) return
    await Promise.all(
      toMove.map(async (moveItem: ISelectedFile) => {
        const itemToMove = pathContents.find((i) => i.cid === moveItem.cid && i.name === moveItem.name)
        if (!itemToMove) return
        try {
          await storageApiClient.moveBucketObjects(bucket.id, {
            path: getPathWithFile(currentPath, itemToMove.name),
            new_path: getPathWithFile(newPath, itemToMove.name)
          })
          const message = `${
            itemToMove.isFolder ? t`Folder` : t`File`
          } ${t`moved successfully`}`

          addToastMessage({
            message: message,
            appearance: "success"
          })
        } catch (error) {
          const message = `${t`There was an error moving this`} ${
            itemToMove.isFolder ? t`folder` : t`file`
          }`
          addToastMessage({
            message: message,
            appearance: "error"
          })
        }
      })).finally(refreshContents)
  }, [addToastMessage, pathContents, refreshContents, storageApiClient, bucket, currentPath])

  const handleDownload = useCallback(async (
  //cid: string
  ) => {
    throw new Error("Not implemented")
    // const itemToDownload = pathContents.find(item => item.cid === cid)
    // if (!itemToDownload || !bucket) return

    // downloadFile(bucket.id, itemToDownload, currentPath)
  }, [
    //pathContents, currentPath, bucket
  ])

  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath), [currentPath])
  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => ({
    text: decodeURIComponent(path),
    onClick: () => {
      redirect(
        ROUTE_LINKS.Bucket(bucketId, getURISafePathFromArray(arrayOfPaths.slice(0, index + 1)))
      )
    }
  })), [arrayOfPaths, bucketId, redirect])

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
        message: t`Folder uploads are currently not supported`,
        appearance: "error"
      })
    } else {
      uploadFiles(bucket.id, files, path)
        .then(() => refreshContents())
        .catch(console.error)
    }
  }, [addToastMessage, uploadFiles, bucket, refreshContents])

  const viewFolder = useCallback((toView: ISelectedFile) => {
    const fileSystemItem = pathContents.find(f => f.cid === toView.cid && f.name === toView.name)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {

      redirect(ROUTE_LINKS.Bucket(bucketId, getUrlSafePathWithFile(currentPath, fileSystemItem.name)))
    }
  }, [currentPath, pathContents, redirect, bucketId])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["delete", "move"],
    [CONTENT_TYPES.File]: ["delete", "move"]
  }), [])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.Audio]: [],
    [CONTENT_TYPES.MP4]: [],
    [CONTENT_TYPES.Image]: [],
    [CONTENT_TYPES.Pdf]: [],
    [CONTENT_TYPES.Text]: [],
    [CONTENT_TYPES.File]: ["delete", "move"],
    [CONTENT_TYPES.Directory]: ["delete", "move"]
  }), [])

  return (
    <FileBrowserContext.Provider value={{
      bucket,
      bulkOperations,
      crumbs,
      moduleRootPath: ROUTE_LINKS.Bucket(bucketId, "/"),
      currentPath,
      refreshContents,
      deleteItems,
      downloadFile: handleDownload,
      moveItems,
      renameItem,
      viewFolder,
      handleUploadOnDrop,
      uploadsInProgress,
      loadingCurrentPath,
      showUploadsInTable: true,
      sourceFiles: pathContents,
      heading: bucket?.name,
      controls: true,
      allowDropUpload: true,
      itemOperations,
      withSurvey: showSurvey
    }}>
      <DragAndDrop>
        <FilesList />
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default BucketPage
