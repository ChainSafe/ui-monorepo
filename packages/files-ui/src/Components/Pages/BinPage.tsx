import React from "react"
import BinFileBrowser from "../Modules/FileBrowsers/BinFileBrowser"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const BinPage = () => {
  return <>
    <Helmet>
      <title>{t`Bin`} - Chainsafe Files</title>
    </Helmet>
    <BinFileBrowser />
  </>
}

export default BinPage
