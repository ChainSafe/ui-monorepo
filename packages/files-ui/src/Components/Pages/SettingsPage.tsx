import React from "react"
import Settings from "../Modules/Settings"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const SettingsPage = () => {
  return <>
    <Helmet>
      <title>{t`Settings`} - Chainsafe Files</title>
    </Helmet>
    <Settings />
  </>
}

export default SettingsPage
