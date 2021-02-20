import React, { useEffect, useState } from "react"
import { SearchEntry, useDrive } from "../../../Contexts/DriveContext"
import { IFileConfigured, IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { useHistory } from "@chainsafe/common-components"
import { getParentPathFromFilePath } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { useQuery } from "../../../Utils/Helpers"

const SearchFileBrowser: React.FC<IFilesBrowserModuleProps> = ({
  heading = "Search results",
  controls = false,
}: IFilesBrowserModuleProps) => {
  const { updateCurrentPath, desktop, getSearchResults } = useDrive()
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

  const viewFolder = (cid: string) => {
    const searchEntry = searchResults.find(
      (result) => result.content.cid === cid,
    )
    if (searchEntry) {
      if (searchEntry.content.content_type === CONTENT_TYPES.Directory) {
        redirect(ROUTE_LINKS.Home(searchEntry.path))
      } else {
        redirect(ROUTE_LINKS.Home(getParentPathFromFilePath(searchEntry.path)))
      }
    }
  }

  const pathContents: IFileConfigured[] = searchResults.map((searchResult) => ({
    ...searchResult.content,
    isFolder: searchResult.content.content_type === CONTENT_TYPES.Directory,
    operations: ["view_folder"],
  }))

  return (
    <DragAndDrop>
      <FilesTableView
        crumbs={undefined}
        loadingCurrentPath={loadingSearchResults}
        showUploadsInTable={false}
        viewFolder={viewFolder}
        sourceFiles={pathContents}
        updateCurrentPath={updateCurrentPath}
        heading={heading}
        controls={controls}
        desktop={desktop}
      />
    </DragAndDrop>
  )
}

export default SearchFileBrowser
