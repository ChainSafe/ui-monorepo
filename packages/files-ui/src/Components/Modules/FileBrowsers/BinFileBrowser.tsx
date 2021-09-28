import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { IBulkOperations, IFileBrowserModuleProps } from "./types"
import FilesList from "./views/FilesList"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { IFilesTableBrowserProps } from "../../Modules/FileBrowsers/types"
import { useHistory, useLocation, useToasts } from "@chainsafe/common-components"
import { extractFileBrowserPathFromURL, getPathWithFile, getUrlSafePathWithFile } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { parseFileContentResponse } from "../../../Utils/Helpers"

const BinFileBrowser: React.FC<IFileBrowserModuleProps> = ({ controls = false }: IFileBrowserModuleProps) => {
  const { buckets } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { addToast } = useToasts()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { pathname } = useLocation()
  const currentPath = useMemo(() => extractFileBrowserPathFromURL(pathname, ROUTE_LINKS.Bin("")), [pathname])
  const { redirect } = useHistory()

  const bucket = useMemo(() => buckets.find(b => b.type === "trash"), [buckets])

  const refreshContents = useCallback(
    (
      showLoading?: boolean
    ) => {
      if (!bucket) return
      try {
        showLoading && setLoadingCurrentPath(true)
        filesApiClient.getBucketObjectChildrenList(bucket.id, { path: currentPath })
          .then((newContents) => {
            showLoading && setLoadingCurrentPath(false)
            setPathContents(
              newContents.map((fcr) => parseFileContentResponse(fcr))
            )
          }).catch((error) => {
            throw error
          })
      } catch (error) {
        console.error(error)
        showLoading && setLoadingCurrentPath(false)
      }
    },
    [bucket, currentPath, filesApiClient]
  )
  useEffect(() => {
    refreshContents(true)
  }, [bucket, refreshContents])

  const deleteItems = useCallback(async (cids: string[]) => {
    if (!bucket) return

    const pathsToDelete = cids.map((cid: string) => {
      const itemToDelete = pathContents.find((i) => i.cid === cid)
      if (itemToDelete) {
        return getPathWithFile(currentPath, itemToDelete.name)
      }
      return undefined
    }).filter((item): item is string => !!item)
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
      }).finally(refreshContents)
  }, [addToast, bucket, currentPath, filesApiClient, pathContents, refreshContents])

  const recoverItems = useCallback(async (cids: string[], newPath: string) => {
    if (!bucket) return

    const pathsToRecover = cids.map((cid: string) => {
      const itemToRecover = pathContents.find((i) => i.cid === cid)
      if (itemToRecover) {
        return getPathWithFile(currentPath, itemToRecover.name)
      }
      return undefined
    }).filter((item): item is string => !!item)

    filesApiClient.moveBucketObjects(
      bucket.id,
      {
        paths: pathsToRecover,
        new_path: newPath,
        destination: buckets.find(b => b.type === "csf")?.id
      }
    ).then(() => {
      addToast({
        title: t`Data restored successfully`,
        type: "success"
      })
    }).catch((error) => {
      console.error("Error recovering:", error)
      addToast({
        title: t`There was an error restoring your data`,
        type: "error"
      })
    }).finally(refreshContents)
  }, [addToast, pathContents, refreshContents, filesApiClient, bucket, buckets, currentPath])

  const viewFolder = useCallback((cid: string) => {
    const fileSystemItem = pathContents.find(f => f.cid === cid)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {
      redirect(ROUTE_LINKS.Bin(getUrlSafePathWithFile(currentPath, fileSystemItem.name)))
    }
  }, [currentPath, pathContents, redirect])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: ["recover", "delete"],
    [CONTENT_TYPES.File]: ["recover", "delete"]
  }), [])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.File]: ["recover", "delete"],
    [CONTENT_TYPES.Directory]: ["recover", "delete"]
  }), [])

  return (
    <FileBrowserContext.Provider value={{
      bucket,
      crumbs: undefined,
      deleteItems,
      recoverItems,
      currentPath,
      moduleRootPath: ROUTE_LINKS.Bin("/"),
      refreshContents,
      loadingCurrentPath,
      showUploadsInTable: false,
      sourceFiles: pathContents,
      heading: t`Bin`,
      controls,
      itemOperations,
      bulkOperations,
      viewFolder
    }}>
      <DragAndDrop>
        <FilesList />
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default BinFileBrowser
