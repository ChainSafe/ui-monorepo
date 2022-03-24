import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import SharedFoldersOverview from "../Modules/FileBrowsers/SharedFoldersOverview"
import { Helmet } from "react-helmet-async"

const SharedFoldersPage = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>Shared folders - Chainsafe Files</title>
    </Helmet>
    <SharedFoldersOverview />
  </>
}

export default SharedFoldersPage
