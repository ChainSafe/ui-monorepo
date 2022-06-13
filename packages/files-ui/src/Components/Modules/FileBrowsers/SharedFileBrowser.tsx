import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  useToasts,
  useHistory,
  useLocation,
  Crumb,
  Typography,
  ExclamationCircleIcon,
  Loading,
  getFilesAndEmptyDirFromDataTransferItems
} from "@chainsafe/common-components"
import {
  getArrayOfPaths,
  getURISafePathFromArray,
  getPathWithFile,
  extractSharedFileBrowserPathFromURL,
  getUrlSafePathWithFile,
  getAbsolutePathsFromCids,
  pathEndingWithSlash
} from "../../../Utils/pathUtils"
import { IBulkOperations, IFilesTableBrowserProps } from "./types"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { t, Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"
import { parseFileContentResponse } from "../../../Utils/Helpers"
import { BucketKeyPermission, BucketPermission, FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { useUser } from "../../../Contexts/UserContext"
import DragAndDrop from "../../../Contexts/DnDContext"
import FilesList from "./views/FilesList"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Helmet } from "react-helmet-async"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    messageWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    icon : {
      display: "flex",
      alignItems: "center",
      fontSize: constants.generalUnit * 6,
      "& svg": {
        fill: palette.additional["gray"][7]
      }
    }
  }))

const SharedFileBrowser = () => {
  const { downloadFile, uploadFiles, buckets, getStorageSummary, refreshBuckets, storageSummary } = useFiles()
  const { filesApiClient, accountRestricted } = useFilesApi()
  const classes = useStyles()
  const { addToast } = useToasts()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { redirect } = useHistory()
  const { pathname } = useLocation()
  const [bucket, setBucket] = useState<BucketKeyPermission | undefined>()
  const [isBucketLoaded, setIsBucketLoaded] = useState(false)

  const bucketId = useMemo(() =>
    pathname.split("/")[2]
  , [pathname])

  useEffect(() => {
    if (!buckets.length || !bucketId) return

    const newBuck = buckets.find(b => b.id === bucketId)
    setBucket(newBuck)
    setIsBucketLoaded(true)
  }, [bucketId, buckets])

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
  const currentFolder = useMemo(() => {
    return !!arrayOfPaths.length && arrayOfPaths[arrayOfPaths.length - 1]
  }, [arrayOfPaths])

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

  const deleteItems = useCallback(async (cids: string[]) => {
    if (!bucket) return

    const pathsToDelete = getAbsolutePathsFromCids(cids, currentPath, pathContents)

    filesApiClient.removeBucketObject(bucket.id, { paths: pathsToDelete })
      .then(() => {
        addToast({
          title: t`Data deleted successfully`,
          type: "success",
          testId: "deletion-success"
        })
      }).catch((error) => {
        console.error("Error deleting:", error)
        addToast({
          title: t`There was an error deleting your data`,
          type: "error"
        })
      }).finally(() => {
        refreshContents()
        refreshBuckets()
      })
  }, [addToast, bucket, currentPath, filesApiClient, pathContents, refreshBuckets, refreshContents])

  // Rename
  const renameItem = useCallback(async (cid: string, newName: string) => {
    const itemToRename = pathContents.find(i => i.cid === cid)
    if (!bucket || !itemToRename) return

    return filesApiClient.moveBucketObjects(bucket.id, {
      paths: [getPathWithFile(currentPath, itemToRename.name)],
      new_path: getPathWithFile(currentPath, newName) }).then(() => refreshContents())
      .catch(console.error)
  }, [refreshContents, filesApiClient, bucket, currentPath, pathContents])

  const moveItems = useCallback(async (cids: string[], newPath: string) => {
    if (!bucket) return

    const pathsToMove = getAbsolutePathsFromCids(cids, currentPath, pathContents)

    filesApiClient.moveBucketObjects(bucket.id, {
      paths: pathsToMove,
      new_path: pathEndingWithSlash(newPath)
    }).then(() => {
      addToast({
        title: t`Data moved successfully`,
        type: "success"
      })
    }).catch((error) => {
      console.error("Error recovering:", error)
      addToast({
        title: t`There was an error restoring your data`,
        type: "error"
      })
    }).finally(refreshContents)
  }, [refreshContents, filesApiClient, bucket, currentPath, pathContents, addToast])

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
    if (accountRestricted && bucket.permission === "owner") {
      addToast({
        type:"error",
        title: t`Uploads disabled`,
        subtitle: t`Your account is restricted. Until you&apos;ve settled up, you can&apos;t upload any new content.`
      })
      return
    }
    const availableStorage = storageSummary?.available_storage || 0
    const uploadSize = files?.reduce((total: number, file: File) => total += file.size, 0) || 0

    if (bucket.permission === "owner" && uploadSize > availableStorage) {
      addToast({
        type: "error",
        title: t`Upload size exceeds plan capacity`,
        subtitle: t`Please select fewer files to upload`
      })
      return
    }

    const flattenedFiles = await getFilesAndEmptyDirFromDataTransferItems(fileItems)
    flattenedFiles.files?.length && await uploadFiles(bucket, flattenedFiles.files, path)

    //create empty dir
    if(flattenedFiles?.emptyDirPaths?.length){
      const allDirs = flattenedFiles.emptyDirPaths.map((folderPath) =>
        filesApiClient.addBucketDirectory(bucket.id, { path: getPathWithFile(currentPath, folderPath) })
      )

      Promise.all(allDirs)
        .then(() => refreshContents(true))
        .catch(console.error)
    }
  }, [bucket, accountRestricted, storageSummary, uploadFiles, addToast, filesApiClient, currentPath, refreshContents])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["download", "move", "delete", "share"],
    [CONTENT_TYPES.File]: ["download", "delete", "move", "share"]
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
          [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete", "share"],
          [CONTENT_TYPES.Directory]: ["rename", "move", "delete", "share"]
        }
      case "writer":
        return {
          [CONTENT_TYPES.Audio]: ["preview"],
          [CONTENT_TYPES.MP4]: ["preview"],
          [CONTENT_TYPES.Image]: ["preview"],
          [CONTENT_TYPES.Pdf]: ["preview"],
          [CONTENT_TYPES.Text]: ["preview"],
          [CONTENT_TYPES.File]: ["download", "info", "rename", "move", "delete", "report", "share"],
          [CONTENT_TYPES.Directory]: ["rename", "move", "delete", "share"]
        }
        // case "reader":
      default:
        return {
          [CONTENT_TYPES.Audio]: ["preview"],
          [CONTENT_TYPES.MP4]: ["preview"],
          [CONTENT_TYPES.Image]: ["preview"],
          [CONTENT_TYPES.Pdf]: ["preview"],
          [CONTENT_TYPES.Text]: ["preview"],
          [CONTENT_TYPES.File]: ["download", "info", "report", "share"],
          [CONTENT_TYPES.Directory]: []
        }
    }
  }, [access])

  if (!isBucketLoaded) {
    return (
      <div className={classes.messageWrapper}>
        <Loading
          type="initial"
          size={48}
        />
      </div>
    )
  }

  // The bucket is loaded, and it is still undefined
  if (!bucket) {
    return (
      <div className={classes.messageWrapper}>
        <ExclamationCircleIcon
          size={48}
          className={classes.icon}
        />
        <Typography variant="h4">
          <Trans>You do not have access to this shared folder.</Trans>
        </Typography>
      </div>
    )
  }


  return (
    <FileBrowserContext.Provider
      value={{
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
      {(!!currentFolder || bucket.name) &&
        <Helmet>
          <title>{currentFolder || bucket.name} - Chainsafe Files</title>
        </Helmet>
      }
      <DragAndDrop>
        <FilesList isShared/>
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default SharedFileBrowser
