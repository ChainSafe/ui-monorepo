import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import SearchFileBrowser from "../Modules/FileBrowsers/SearchFileBrowser"

const SearchPage = () => {
  usePageTrack()

  return <SearchFileBrowser />
}

export default SearchPage
