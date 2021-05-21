import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FileSystemItem, useFiles } from "../../../Contexts/FilesContext"
import { IBulkOperations, IFileBrowserModuleProps } from "./types"
import FilesList from "./views/FilesList"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { IFilesTableBrowserProps } from "../../Modules/FileBrowsers/types"
import { useLocation, useToaster } from "@chainsafe/common-components"
import { extractDrivePath, getPathWithFile } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"
import { useFilesApi } from "@chainsafe/common-contexts"
import { parseFileContentResponse } from "../../../Utils/Helpers"

const BinFileBrowser: React.FC<IFileBrowserModuleProps> = ({ controls = false }: IFileBrowserModuleProps) => {
  const { buckets } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const { pathname } = useLocation()
  const [currentPath, setCurrentPath] = useState(extractDrivePath(pathname.split("/").slice(1).join("/")))

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
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let binPath = extractDrivePath(pathname)
    if (binPath[0] !== "/") {
      binPath = "/" + binPath
    }
    if (binPath !== currentPath) {
      setCurrentPath(decodeURI(binPath))
      refreshContents(true)
    }
  }, [refreshContents, pathname, currentPath])


  const deleteFile = useCallback(async (cid: string) => {
    const itemToDelete = pathContents.find((i) => i.cid === cid)

    if (!itemToDelete || !bucket) {
      console.error("No item found to delete")
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
  }, [addToastMessage, bucket, currentPath, pathContents, refreshContents, filesApiClient])

  const deleteFiles = useCallback(async (cids: string[]) => {
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
        if (!itemToRestore) throw new Error("Not found")
        try {
          await filesApiClient.moveFPSObject(bucket.id, {
            path: getPathWithFile("/", itemToRestore.name),
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
  }, [addToastMessage, pathContents, refreshContents, filesApiClient, bucket])

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
      deleteItems: deleteFiles,
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
      bulkOperations
    }}>
      <DragAndDrop>
        <FilesList />
      </DragAndDrop>
    </FileBrowserContext.Provider>
  )
}

export default BinFileBrowser
