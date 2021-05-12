import React, { useCallback, useEffect, useMemo, useState } from "react"
import { BucketType, FileSystemItem, useDrive } from "../../../Contexts/DriveContext"
import { IBulkOperations, IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import DragAndDrop from "../../../Contexts/DnDContext"
import { t } from "@lingui/macro"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import { IFilesTableBrowserProps } from "../../Modules/FileBrowsers/types"
import { guessContentType } from "../../../Utils/contentTypeGuesser"
import { useLocation, useToaster } from "@chainsafe/common-components"
import { extractDrivePath, getPathWithFile } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"

const BinFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = false }: IFilesBrowserModuleProps) => {
  const { removeCSFObjects, moveCSFObject, list } = useDrive()
  const { addToastMessage } = useToaster()
  const [loadingCurrentPath, setLoadingCurrentPath] = useState(false)
  const [pathContents, setPathContents] = useState<FileSystemItem[]>([])
  const bucketType: BucketType = "trash"
  const { pathname } = useLocation()
  const [currentPath, setCurrentPath] = useState(extractDrivePath(pathname.split("/").slice(1).join("/")))

  const refreshContents = useCallback(
    (
      showLoading?: boolean
    ) => {
      try {
        showLoading && setLoadingCurrentPath(true)
        list({
          path: currentPath,
          source: {
            type: bucketType
          }
        }).then((newContents) => {
          showLoading && setLoadingCurrentPath(false)

          setPathContents(
            newContents.map((fcr) => ({
              ...fcr,
              content_type:
                fcr.content_type !== "application/octet-stream"
                  ? fcr.content_type
                  : guessContentType(fcr.name),
              isFolder:
                fcr.content_type === "application/chainsafe-files-directory"
            }))
          )
        }).catch((error) => {
          throw error
        })
      } catch (error) {
        console.error(error)
        showLoading && setLoadingCurrentPath(false)
      }
    },
    [bucketType, list, currentPath]
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

    if (!itemToDelete) {
      console.error("No item found to delete")
      return
    }

    try {
      await removeCSFObjects({
        paths: [`${currentPath}${itemToDelete.name}`],
        source: {
          type: bucketType
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
  }, [addToastMessage, bucketType, currentPath, pathContents, refreshContents, removeCSFObjects])

  const deleteFiles = useCallback(async (cids: string[]) => {
    await Promise.all(
      cids.map((cid: string) =>
        deleteFile(cid)
      ))
    refreshContents()
  }, [deleteFile, refreshContents])


  const recoverFile = useCallback(async (cid: string) => {
    const itemToRestore = pathContents.find((i) => i.cid === cid)
    if (!itemToRestore) throw new Error("Not found")
    try {
      await moveCSFObject({
        path: getPathWithFile("/", itemToRestore.name),
        new_path: getPathWithFile("/", itemToRestore.name),
        source: {
          type: "trash"
        },
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
      return Promise.reject()
    }
  }, [addToastMessage, moveCSFObject, pathContents, refreshContents])

  const recoverFiles = useCallback(async (cids: string[]) => {
    return Promise.all(
      cids.map((cid: string) =>
        recoverFile(cid)
      ))
  }, [recoverFile])

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
      crumbs: undefined,
      recoverFile,
      deleteFiles,
      recoverFiles,
      currentPath,
      moduleRootPath: ROUTE_LINKS.Bin("/"),
      refreshContents,
      loadingCurrentPath,
      showUploadsInTable: false,
      sourceFiles: pathContents,
      heading: t`Bin`,
      controls,
      bucketType,
      itemOperations,
      bulkOperations,
    }}>
      <DragAndDrop>
        <FilesTableView />
      </DragAndDrop>
    </FileBrowserContext.Provider>
   
  )
}

export default BinFileBrowser
