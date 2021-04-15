import React from "react"
import { ChainsafeLogo } from "../Logos"

export default {
  title: "Chainsafe Logo",
  component: ChainsafeLogo,
  excludeStories: /.*Data$/
}

export const Default = (): React.ReactNode => <ChainsafeLogo />
