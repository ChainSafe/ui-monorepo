import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import CSFFileBrowser from "../Modules/FileBrowsers/CSFFileBrowser"
import { Helmet } from "react-helmet-async"

const DrivePage = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>Home - Chainsafe Files</title>
    </Helmet>
    <CSFFileBrowser />
  </>
}

export default DrivePage
