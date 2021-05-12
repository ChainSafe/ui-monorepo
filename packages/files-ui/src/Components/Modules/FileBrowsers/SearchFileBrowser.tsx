import React, { useCallback, useEffect, useMemo, useState } from "react"
import { BucketType, FileSystemItem, SearchEntry, useDrive } from "../../../Contexts/DriveContext"
import { IFilesBrowserModuleProps, IFilesTableBrowserProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { useHistory, useLocation, useToaster } from "@chainsafe/common-components"
import { getParentPathFromFilePath } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { t } from "@lingui/macro"
import { SearchParams } from "../SearchModule"
import { FileBrowserContext } from "../../../Contexts/FileBrowserContext"

const SearchFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = false }: IFilesBrowserModuleProps) => {
  const { pathname } = useLocation()
  const [searchTerm, setSearchTerm] = useState(pathname.split("/").slice(2)[0])
  const { redirect } = useHistory()

  const { listBuckets, searchFiles } = useDrive()

  const [bucketType] = useState<BucketType>("csf")
  const [currentSearchBucket, setCurrentSearchBucket] = useState<SearchParams | undefined>()
  const { addToastMessage } = useToaster()

  const getSearchResults = useCallback(async (searchString: string) => {
    try {
      if (!searchString) return []
      let bucketId
      if (
        currentSearchBucket &&
        currentSearchBucket.bucketType === bucketType
      ) {
        // we have the bucket id
        bucketId = currentSearchBucket.bucketId
      } else {
        // fetch bucket id
        const results = await listBuckets(bucketType)
        const bucket1 = results[0]
        setCurrentSearchBucket({
          bucketType,
          bucketId: bucket1.id
        })
        bucketId = bucket1.id
      }
      const results = await searchFiles(bucketId || "", searchString)
      return results
    } catch (err) {
      addToastMessage({
        message: t`There was an error getting search results`,
        appearance: "error"
      })
      return Promise.reject(err)
    }
  }, [addToastMessage, bucketType, currentSearchBucket, listBuckets, searchFiles])

  useEffect(() => {
    const drivePath = pathname.split("/").slice(2)[0]

    setSearchTerm(decodeURI(drivePath))
    getSearchResults(decodeURI(drivePath))
  }, [getSearchResults, pathname])

  const [loadingSearchResults, setLoadingSearchResults] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchEntry[]>([])


  useEffect(() => {
    const onSearch = async () => {
      if (searchTerm) {
        try {
          setLoadingSearchResults(true)
          const results = await getSearchResults(searchTerm)
          setSearchResults(results)
          setLoadingSearchResults(false)
        } catch {
          setLoadingSearchResults(false)
        }
      }
    }
    onSearch()
    // eslint-disable-next-line
  }, [searchTerm])

  const getSearchEntry = useCallback((cid: string) =>
    searchResults.find(
      (result) => result.content.cid === cid
    )
  , [searchResults])

  const viewFolder = (cid: string) => {
    const searchEntry = getSearchEntry(cid)
    if (searchEntry) {
      if (searchEntry.content.content_type === CONTENT_TYPES.Directory) {
        redirect(ROUTE_LINKS.Drive(searchEntry.path))
      } else {
        redirect(ROUTE_LINKS.Drive(getParentPathFromFilePath(searchEntry.path)))
      }
    }
  }

  const getPath = useCallback((cid: string): string => {
    const searchEntry = getSearchEntry(cid)
    // Set like this as look ups should always be using available cids
    return searchEntry ? searchEntry.path : ""
  }, [getSearchEntry])

  const pathContents: FileSystemItem[] = useMemo(() =>
    searchResults.map((searchResult) => ({
      ...searchResult.content,
      isFolder: (searchResult.content.content_type === CONTENT_TYPES.Directory)
    }))
  , [searchResults])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.File]: ["view_folder"],
    [CONTENT_TYPES.Directory]: ["view_folder"]
  }), [])

  return (
    <FileBrowserContext.Provider value={{
      crumbs: undefined,
      loadingCurrentPath: loadingSearchResults,
      showUploadsInTable: false,
      viewFolder,
      sourceFiles: pathContents,
      moduleRootPath: undefined,
      currentPath: searchTerm,
      heading: t`Search results`,
      controls,
      itemOperations,
      isSearch: true,
      bucketType,
      getPath,
    }}>
      <DragAndDrop>
        <FilesTableView />
      </DragAndDrop>
    </FileBrowserContext.Provider>
    
  )
}

export default SearchFileBrowser
