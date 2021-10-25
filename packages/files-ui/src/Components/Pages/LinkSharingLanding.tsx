import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import LinkSharingModule from "../Modules/LinkSharingModule"

const LinkSharingLanding = () => {
  usePageTrack()

  return <LinkSharingModule/>
}

export default LinkSharingLanding
