import React from "react"
import SharedFoldersOverview from "../Modules/FileBrowsers/SharedFoldersOverview"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const SharedFoldersPage = () => {
  return <>
    <Helmet>
      <title>{t`Shared folders`} - Chainsafe Files</title>
    </Helmet>
    <SharedFoldersOverview />
  </>
}

export default SharedFoldersPage
