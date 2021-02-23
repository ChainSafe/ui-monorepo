import React from "react"
import { Blockies } from "../Blockies"

export default {
  title: "Blockies",
  component: Blockies,
  excludeStories: /.*Data$/
}

export const BlockiesDefault = (): React.ReactNode => (
  <Blockies seed="randomness" />
)
