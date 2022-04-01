import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import BinFileBrowser from "../Modules/FileBrowsers/BinFileBrowser"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const BinPage = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>{t`Bin`} - Chainsafe Files</title>
    </Helmet>
    <BinFileBrowser />
  </>
}

export default BinPage
