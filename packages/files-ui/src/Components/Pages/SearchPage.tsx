import { t } from "@lingui/macro"
import React from "react"
import SearchFileBrowser from "../Modules/FileBrowsers/SearchFileBrowser"

const SearchPage = () => {
  return <SearchFileBrowser heading={t`Search results`}/>
}

export default SearchPage
