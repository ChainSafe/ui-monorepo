import React from "react"
import {usePageTrack} from "../../Contexts/PosthogContext"
import SharedFileBrowser from "../Modules/FileBrowsers/SharedFileBrowser"

const ShareFilesPage = () => {
  usePageTrack()

  return <SharedFileBrowser />
}

export default ShareFilesPage
