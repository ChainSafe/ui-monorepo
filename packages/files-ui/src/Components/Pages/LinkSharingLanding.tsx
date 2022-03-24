import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import LinkSharingModule from "../Modules/LinkSharingModule"
import { Helmet } from "react-helmet-async"

const LinkSharingLanding = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>Shared link - Chainsafe Files</title>
    </Helmet>
    <LinkSharingModule/>
  </>
}

export default LinkSharingLanding
