import React from "react"
import {usePageTrack} from "../../Contexts/PosthogContext"
import Settings from "../Modules/Settings"

const SettingsPage = () => {
  usePageTrack()

  return <Settings />
}

export default SettingsPage
