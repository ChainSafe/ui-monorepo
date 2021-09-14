import React from "react"
import {usePageTrack} from "../../Contexts/PosthogContext"
import CSFFileBrowser from "../Modules/FileBrowsers/CSFFileBrowser"

const DrivePage = () => {
  usePageTrack()

  return <CSFFileBrowser />
}

export default DrivePage
