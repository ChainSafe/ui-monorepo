import React from "react"
import { withKnobs, select, boolean } from "@storybook/addon-knobs"
import { Paper } from "../Paper"

export default {
  title: "Paper",
  component: Paper,
  decorators: [withKnobs],
}

export const PaperDemo = (): React.ReactNode => (
  <Paper
    shape={select("shape", ["rounded", "square"], "rounded")}
    border={boolean("border", false)}
    fullWidth={boolean("full width", false)}
  >
    Paper content
  </Paper>
)
