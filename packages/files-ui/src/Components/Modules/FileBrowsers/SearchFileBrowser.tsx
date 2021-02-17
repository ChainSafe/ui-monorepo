import React, { useEffect, useState } from "react"
import { SearchEntry, useDrive } from "../../../Contexts/DriveContext"
import { IFileConfigured, IFilesBrowserModuleProps } from "./types"
import FilesTableView from "./views/FilesTable.view"
import { CONTENT_TYPES } from "../../../Utils/Constants"
import DragAndDrop from "../../../Contexts/DnDContext"
import { useLocation, useHistory } from "@chainsafe/common-components"
import { getParentPathFromFilePath } from "../../../Utils/pathUtils"
import { ROUTE_LINKS } from "../../FilesRoutes"

const SearchFileBrowser: React.FC<IFilesBrowserModuleProps> = ({
  heading = "Search results",
  controls = false,
}: IFilesBrowserModuleProps) => {
  const { updateCurrentPath, desktop, getSearchResults } = useDrive()
  const { redirect } = useHistory()

  const [loadingSearchResults, setLoadingSearchResults] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchEntry[]>([])

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  const searchString = useQuery().get("search")

  useEffect(() => {
    const onSearch = async () => {
      if (searchString) {
        try {
          setLoadingSearchResults(true)
          const results = await getSearchResults(searchString)
          setSearchResults(results)
          setLoadingSearchResults(false)
        } catch {
          //
          setLoadingSearchResults(false)
        }
      }
    }
    onSearch()
    // eslint-disable-next-line
  }, [searchString])

  const viewFolder = (cid: string) => {
    const searchEntry = searchResults.find(
      (result) => result.content.cid === cid,
    )
    if (searchEntry) {
      redirect(ROUTE_LINKS.Home)
      if (searchEntry.content.content_type === CONTENT_TYPES.Directory) {
        updateCurrentPath(searchEntry.path, "csf", true)
      } else {
        updateCurrentPath(
          getParentPathFromFilePath(searchEntry.path),
          "csf",
          true,
        )
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
