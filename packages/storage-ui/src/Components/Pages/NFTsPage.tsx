import React, { useCallback, useEffect, useMemo, useState } from "react"
import {  useLocation } from "@chainsafe/common-components"
import { useStorage, FileSystemItem } from "../../Contexts/StorageContext"
import {
  extractFileBrowserPathFromURL
} from "../../Utils/pathUtils"
import {  IFileBrowserModuleProps } from "../../Contexts/types"
import FilesList from "../Modules/FilesList/FilesList"
import DragAndDrop from "../../Contexts/DnDContext"
import { ROUTE_LINKS } from "../../Components/StorageRoutes"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { FileBrowserContext } from "../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../Utils/Helpers"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../Modules/SurveyBanner"
import { usePageTrack } from "../../Contexts/PosthogContext"
import { Helmet } from "react-helmet-async"

const BucketPage: React.FC<IFileBrowserModuleProps> = () => {
  const { storageBuckets, getStorageSummary } = useStorage()
  const { storageApiClient } = useStorageApi()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
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



  return (
    <>
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
          <title>NFTs - Chainsafe Storage</title>
        </Helmet>
        }
        <DragAndDrop>
          <FilesList />
        </DragAndDrop>
      </FileBrowserContext.Provider>
    </>
  )
}

export default BucketPage
