import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import LinkSharingModule from "../Modules/LinkSharingModule"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const LinkSharingLanding = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>{t`Shared link`} - Chainsafe Files</title>
    </Helmet>
    <LinkSharingModule/>
  </>
}

export default LinkSharingLanding
