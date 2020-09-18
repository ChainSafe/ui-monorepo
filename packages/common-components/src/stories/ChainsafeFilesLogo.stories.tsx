import { boolean } from "@storybook/addon-knobs"
import React from "react"
import { ChainsafeFilesLogo } from "../ChainsafeFilesLogo"

export default {
  title: "Chainsafe Files Logo",
  component: ChainsafeFilesLogo,
  excludeStories: /.*Data$/,
}

export const Default = (): React.ReactNode => (
  <ChainsafeFilesLogo showText={boolean("Show text", true)} />
)
