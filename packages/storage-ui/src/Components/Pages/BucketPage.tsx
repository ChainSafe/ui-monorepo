import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Crumb, useToasts, useHistory, useLocation, getFilesAndEmptyDirFromDataTransferItems } from "@chainsafe/common-components"
import { useStorage, FileSystemItem } from "../../Contexts/StorageContext"
import {
  getArrayOfPaths,
  getURISafePathFromArray,
  getPathWithFile,
  extractFileBrowserPathFromURL,
  getUrlSafePathWithFile,
  joinArrayOfPaths
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
import { usePageTrack } from "../../Contexts/PosthogContext"
import { Helmet } from "react-helmet-async"

const BucketPage: React.FC<IFileBrowserModuleProps> = () => {
  const { storageBuckets, uploadFiles, getStorageSummary, downloadFile } = useStorage()
  const { storageApiClient, accountRestricted } = useStorageApi()
  const { addToast } = useToasts()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { redirect } = useHistory()
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const showSurvey = localStorageGet(DISMISSED_SURVEY_KEY) === "false"
  const { pathname } = useLocation()
  usePageTrack()

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
      addToast({
        title: t`Deletion successful`,
        type: "success",
        testId: "deletion-complete"
      })
    })
      .catch((e) => {
        console.error(e)
        const message = t`There was an error deleting this item`
        addToast({
          title: message,
          type: "error"
        })
      })
      .finally(refreshContents)
  }, [bucket, storageApiClient, refreshContents, pathContents, currentPath, addToast])

  const renameItem = useCallback(async (item: ISelectedFile, newName: string) => {
    // checking the name is useful for MFS folders since empty folders all have the same cid
    const itemToRename = pathContents.find(i => i.cid === item.cid && i.name === item.name)
    if (!bucket || !itemToRename) return

    return storageApiClient.moveBucketObjects(bucket.id, {
      paths: [getPathWithFile(currentPath, itemToRename.name)],
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
            paths: [getPathWithFile(currentPath, itemToMove.name)],
            new_path: getPathWithFile(newPath, itemToMove.name)
          })
          const message = `${
            itemToMove.isFolder ? t`Folder` : t`File`
          } ${t`moved successfully`}`

          addToast({
            title: message,
            type: "success"
          })
        } catch (error) {
          const message = `${t`There was an error moving this`} ${
            itemToMove.isFolder ? t`folder` : t`file`
          }`
          addToast({
            title: message,
            type: "error"
          })
        }
      })).finally(refreshContents)
  }, [addToast, pathContents, refreshContents, storageApiClient, bucket, currentPath])

  const handleDownload = useCallback(async (
    toDownload: ISelectedFile
  ) => {
    const itemToDownload = pathContents.find(item => item.cid === toDownload.cid)
    if (!itemToDownload || !bucket) return

    downloadFile(bucket.id, itemToDownload, currentPath)
  }, [
    pathContents, currentPath, bucket, downloadFile
  ])

  // Breadcrumbs/paths
  const arrayOfPaths = useMemo(() => getArrayOfPaths(currentPath), [currentPath])

  const crumbs: Crumb[] = useMemo(() => arrayOfPaths.map((path, index) => {
    return {
      text: decodeURIComponent(path),
      onClick: () => {
        redirect(
          ROUTE_LINKS.Bucket(bucketId, getURISafePathFromArray(arrayOfPaths.slice(0, index + 1)))
        )
      },
      path: joinArrayOfPaths(arrayOfPaths.slice(0, index + 1))
    }}), [arrayOfPaths, redirect, bucketId])

  const currentFolder = useMemo(() => {
    return !!arrayOfPaths.length && arrayOfPaths[arrayOfPaths.length - 1]
  }, [arrayOfPaths])

  const handleUploadOnDrop = useCallback(async (files: File[], fileItems: DataTransferItemList, path: string) => {
    if (!bucket) return

    if (accountRestricted) {
      addToast({
        type:"error",
        title: t`Uploads disabled`,
        subtitle: t`Your account is restricted. Until you&apos;ve settled up, you can&apos;t upload any new content.`
      })
      return
    }

    const flattenedFiles = await getFilesAndEmptyDirFromDataTransferItems(fileItems)
    flattenedFiles.files?.length && await uploadFiles(bucket.id, flattenedFiles.files, path)

    //create empty dir
    if(flattenedFiles?.emptyDirPaths?.length){
      const allDirs = flattenedFiles.emptyDirPaths.map((folderPath) =>
        storageApiClient.addBucketDirectory(bucket.id, { path: getPathWithFile(currentPath, folderPath) })
      )

      await Promise.all(allDirs)
        .catch(console.error)
    }

    refreshContents(true)
  }, [bucket, accountRestricted, uploadFiles, addToast, storageApiClient, currentPath, refreshContents])

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
    [CONTENT_TYPES.File]: ["download", "rename", "move", "delete"],
    [CONTENT_TYPES.Directory]: ["rename", "move", "delete"]
  }), [])

  return (
    <FileBrowserContext.Provider
      value={{
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
        loadingCurrentPath,
        sourceFiles: pathContents,
        heading: bucket?.name,
        controls: true,
        allowDropUpload: true,
        itemOperations,
        withSurvey: showSurvey,
        fileSystemType: bucket?.file_system_type
      }}>
      {(!!currentFolder || bucket?.name) &&
        <Helmet>
          <title>{currentFolder || bucket?.name} - Chainsafe Storage</title>
        </Helmet>
      }
      <DragAndDrop>
        <FilesList />
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default BucketPage
