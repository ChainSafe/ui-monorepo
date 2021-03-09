import { t } from "@lingui/macro"
import React from "react"
import CSFFileBrowser from "../Modules/FileBrowsers/CSFFileBrowser"

const HomePage = () => {
  return <CSFFileBrowser heading = {t`My Files`}/>
}

export default HomePage
