import React from "react"
import CSFFileBrowser from "../Modules/FileBrowsers/CSFFileBrowser"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const DrivePage = () => {
  return <>
    <Helmet>
      <title>{t`Home`} - Chainsafe Files</title>
    </Helmet>
    <CSFFileBrowser />
  </>
}

export default DrivePage
