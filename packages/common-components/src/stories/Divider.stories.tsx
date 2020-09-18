import React from "react"
import { Divider } from "../Divider"
import { Typography } from "../Typography"

export default {
  title: "Divider",
  component: Divider,
  excludeStories: /.*Data$/,
}

export const Default = (): React.ReactNode => <Divider></Divider>

export const WithChild = () => (
  <Divider>
    <Typography>or</Typography>
  </Divider>
)
