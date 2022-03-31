import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import CSFFileBrowser from "../Modules/FileBrowsers/CSFFileBrowser"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const DrivePage = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>{t`Home`} - Chainsafe Files</title>
    </Helmet>
    <CSFFileBrowser />
  </>
}

export default DrivePage
