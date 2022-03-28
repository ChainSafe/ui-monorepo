import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import LinkSharingModule from "../Modules/LinkSharingModule"
import { Helmet } from "react-helmet-async"
import { Trans } from "@lingui/macro"

const LinkSharingLanding = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title><Trans>Shared link</Trans> - Chainsafe Files</title>
    </Helmet>
    <LinkSharingModule/>
  </>
}

export default LinkSharingLanding
