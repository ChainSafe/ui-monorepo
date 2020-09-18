import React from "react"
import { Card, CardHeader } from "../Card"
import { withKnobs, boolean, select } from "@storybook/addon-knobs"

export default {
  title: "Card",
  component: Card,
  decorators: [withKnobs],
}

export const CardDefault = (): React.ReactNode => (
  <Card
    hoverable={boolean("hoverable", false)}
    border={boolean("border", true)}
    fullWidth={boolean("full width", true)}
    shadow={select(
      "shadow",
      ["shadow1", "shadow2", "none", undefined],
      "shadow1",
    )}
  >
    <CardHeader
      title="This is a demo card"
      dense={boolean("header dense", false)}
    />
    <p>Some content</p>
    <p>Some content</p>
  </Card>
)
