import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FileSystemItem, SearchEntry, useDrive } from "../../../Contexts/DriveContext"
import { IFilesBrowserModuleProps, IFilesTableBrowserProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { useHistory } from "@chainsafe/common-components"
import { getParentPathFromFilePath } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { useQuery } from "../../../Utils/Helpers"
import { t } from "@lingui/macro"

const SearchFileBrowser: React.FC<IFilesBrowserModuleProps> = ({ controls = false }: IFilesBrowserModuleProps) => {
  const { updateCurrentPath, getSearchResults } = useDrive()
  const { redirect } = useHistory()

  const [loadingSearchResults, setLoadingSearchResults] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchEntry[]>([])

  const querySearch = useQuery().get("search")

  useEffect(() => {
    const onSearch = async () => {
      if (querySearch) {
        try {
          setLoadingSearchResults(true)
          const results = await getSearchResults(querySearch)
          setSearchResults(results)
          setLoadingSearchResults(false)
        } catch {
          setLoadingSearchResults(false)
        }
      }
    }
    onSearch()
    // eslint-disable-next-line
  }, [querySearch])

  const getSearchEntry = useCallback((cid: string) =>
    searchResults.find(
      (result) => result.content.cid === cid
    )
  , [searchResults])

  const viewFolder = (cid: string) => {
    const searchEntry = getSearchEntry(cid)
    if (searchEntry) {
      if (searchEntry.content.content_type === CONTENT_TYPES.Directory) {
        redirect(ROUTE_LINKS.Home(searchEntry.path))
      } else {
        redirect(ROUTE_LINKS.Home(getParentPathFromFilePath(searchEntry.path)))
      }
    }
  }

  const getPath = useCallback((cid: string) => {
    const searchEntry = getSearchEntry(cid)
    return searchEntry?.path
  }, [getSearchEntry])

  const pathContents: FileSystemItem[] = useMemo(() =>
    searchResults.map((searchResult) => ({
      ...searchResult.content,
      isFolder: (searchResult.content.content_type === CONTENT_TYPES.Directory)
      || (searchResult.content.content_type === CONTENT_TYPES.Directory2)
    }))
  , [searchResults])

  const itemOperations: IFilesTableBrowserProps["itemOperations"] = useMemo(() => ({
    [CONTENT_TYPES.File]: ["view_folder"],
    [CONTENT_TYPES.Directory]: ["view_folder"]
  }), [])

  return (
    <DragAndDrop>
      <FilesTableView
        crumbs={undefined}
        loadingCurrentPath={loadingSearchResults}
        showUploadsInTable={false}
        viewFolder={viewFolder}
        sourceFiles={pathContents}
        updateCurrentPath={updateCurrentPath}
        heading={t`Search results`}
        controls={controls}
        itemOperations={itemOperations}
        isSearch
        getPath={getPath}
      />
    </DragAndDrop>
  )
}

export default SearchFileBrowser
