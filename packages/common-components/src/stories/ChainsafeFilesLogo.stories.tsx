import React from "react"
import { ChainsafeFilesLogo } from "../Logos"

export default {
  title: "Chainsafe Files Logo",
  component: ChainsafeFilesLogo,
  excludeStories: /.*Data$/
}

export const Default = (): React.ReactNode => <ChainsafeFilesLogo />
