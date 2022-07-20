import React from "react"
import SearchFileBrowser from "../Modules/FileBrowsers/SearchFileBrowser"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const SearchPage = () => {
  return <>
    <Helmet>
      <title>{t`Search results`} - Chainsafe Files</title>
    </Helmet>
    <SearchFileBrowser />
  </>
}

export default SearchPage
