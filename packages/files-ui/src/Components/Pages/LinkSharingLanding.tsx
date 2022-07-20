import React from "react"
import LinkSharingModule from "../Modules/LinkSharingModule"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const LinkSharingLanding = () => {
  return <>
    <Helmet>
      <title>{t`Shared link`} - Chainsafe Files</title>
    </Helmet>
    <LinkSharingModule />
  </>
}

export default LinkSharingLanding
