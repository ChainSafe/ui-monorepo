import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import BinFileBrowser from "../Modules/FileBrowsers/BinFileBrowser"

const BinPage = () => {
  usePageTrack()

  return <BinFileBrowser />
}

export default BinPage
