import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { IBulkOperations, IFileBrowserModuleProps } from "./types"
import FilesList from "./views/FilesList"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { IFilesTableBrowserProps } from "../../Modules/FileBrowsers/types"
import { useHistory, useLocation, useToaster } from "@chainsafe/common-components"
import { extractFileBrowserPathFromURL, getArrayOfPaths, getPathWithFile, getURISafePathFromArray } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { parseFileContentResponse } from "../../../Utils/Helpers"

const BinFileBrowser: React.FC<IFileBrowserModuleProps> = ({ controls = false }: IFileBrowserModuleProps) => {
  const { buckets, refreshBuckets } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { pathname } = useLocation()
  const currentPath = useMemo(() =>
    extractFileBrowserPathFromURL(pathname, ROUTE_LINKS.Bin("")),
  [pathname]
  )
  const { redirect } = useHistory()

  const bucket = useMemo(() => buckets.find(b => b.type === "trash"), [buckets])

  const refreshContents = useCallback(
    (
      showLoading?: boolean
    ) => {
      if (!bucket) return
      try {
        showLoading && setLoadingCurrentPath(true)
        filesApiClient.getFPSChildList(bucket.id, { path: currentPath })
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

  const deleteFile = useCallback(async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)

    if (!itemToDelete || !bucket) {
      console.error("Bucket not set or no item found to delete")
      return
    }

    try {
      await filesApiClient.removeFPSObjects(bucket.id, {
        paths: [`${currentPath}${itemToDelete.name}`],
        source: {
          type: bucket.type
        }
      })
      refreshContents()
      refreshBuckets()
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
    refreshContents()
  }, [deleteFile, refreshContents])

  const recoverItems = useCallback(async (cids: string[]) => {
    if (!bucket) return Promise.reject()
    return Promise.all(
      cids.map(async (cid: string) => {
        const itemToRestore = pathContents.find((i) => i.cid === cid)
        if (!itemToRestore) throw new Error("Item to restore not found")
        try {
          await filesApiClient.moveFPSObject(bucket.id, {
            path: getPathWithFile(currentPath, itemToRestore.name),
            new_path: getPathWithFile("/", itemToRestore.name),
            destination: {
              type: "csf"
            }
          })
          refreshContents()

          const message = `${
            itemToRestore.isFolder ? t`Folder` : t`File`
          } ${t`recovered successfully`}`

          addToastMessage({
            message: message,
            appearance: "success"
          })
          return Promise.resolve()
        } catch (error) {
          const message = `${t`There was an error recovering this`} ${
            itemToRestore.isFolder ? t`folder` : t`file`
          }`
          addToastMessage({
            message: message,
            appearance: "error"
          })
          return Promise.resolve()
        }
      }))
  }, [addToastMessage, pathContents, refreshContents, filesApiClient, bucket, currentPath])

  const viewFolder = useCallback((cid: string) => {
    const fileSystemItem = pathContents.find(f => f.cid === cid)
    if (fileSystemItem && fileSystemItem.content_type === CONTENT_TYPES.Directory) {
      let urlSafePath =  getURISafePathFromArray(getArrayOfPaths(currentPath))
      if (urlSafePath === "/") {
        urlSafePath = ""
      }
      redirect(ROUTE_LINKS.Bin(`${urlSafePath}/${encodeURIComponent(`${fileSystemItem.name}`)}`))
    }
  }, [currentPath, pathContents, redirect])

  const bulkOperations: IBulkOperations = useMemo(() => ({
    [CONTENT_TYPES.Directory]: [],
    [CONTENT_TYPES.File]: ["recover", "delete"]
  }), [])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.File]: ["recover", "delete"],
    [CONTENT_TYPES.Directory]: ["recover", "delete"]
  }), [])

  return (
    <FileBrowserContext.Provider value={{
      bucket: bucket,
      crumbs: undefined,
      deleteItems: deleteItems,
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
