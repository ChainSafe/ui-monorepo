import React, { useCallback, useEffect, useState } from "react"
import { useStorage, FileSystemItem } from "../../Contexts/StorageContext"
import { IFileBrowserModuleProps } from "../../Contexts/types"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { FileBrowserContext } from "../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../Utils/Helpers"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { DISMISSED_SURVEY_KEY } from "../Modules/SurveyBanner"
import { usePageTrack } from "../../Contexts/PosthogContext"
import { Helmet } from "react-helmet-async"
import NFTsList from "../Modules/NFTsList/NFTsList"

const NFTsPage: React.FC<IFileBrowserModuleProps> = () => {
  const { NFTBucket, getStorageSummary } = useStorage()
  const { storageApiClient } = useStorageApi()
  const { localStorageGet, localStorageSet } = useLocalStorage()

  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const showSurvey = localStorageGet(DISMISSED_SURVEY_KEY) === "false"
  usePageTrack()

  useEffect(() => {
    const dismissedFlag = localStorageGet(DISMISSED_SURVEY_KEY)

    if (dismissedFlag === undefined || dismissedFlag === null) {
      localStorageSet(DISMISSED_SURVEY_KEY, "false")
    }
  }, [localStorageGet, localStorageSet])

  const refreshContents = useCallback((showLoading?: boolean) => {
    if (!NFTBucket) return
    showLoading && setLoadingCurrentPath(true)
    storageApiClient.getBucketObjectChildrenList(NFTBucket.id, { path: "/" })
      .then((newContents) => {
        showLoading && setLoadingCurrentPath(false)
        const mappedContents = newContents.map((fcr) => parseFileContentResponse(fcr))
        setPathContents(mappedContents)
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        getStorageSummary()
        showLoading && setLoadingCurrentPath(false)
      })
  }, [NFTBucket, storageApiClient, getStorageSummary])

  useEffect(() => {
    refreshContents(true)
  }, [refreshContents])

  return (
    <>
      <FileBrowserContext.Provider
        value={{
          bucket: NFTBucket,
          moduleRootPath: "/",
          currentPath: "/",
          refreshContents,
          loadingCurrentPath,
          sourceFiles: pathContents,
          heading: "NFTs",
          controls: true,
          allowDropUpload: true,
          withSurvey: showSurvey,
          fileSystemType: NFTBucket?.file_system_type
        }}>
        <Helmet>
          <title>NFTs - Chainsafe Storage</title>
        </Helmet>
        <NFTsList />
      </FileBrowserContext.Provider>
    </>
  )
}

export default NFTsPage
