import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import SharedFoldersOverview from "../Modules/FileBrowsers/SharedFoldersOverview"
import { Helmet } from "react-helmet-async"
import { Trans } from "@lingui/macro"

const SharedFoldersPage = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title><Trans>Shared folders</Trans> - Chainsafe Files</title>
    </Helmet>
    <SharedFoldersOverview />
  </>
}

export default SharedFoldersPage
