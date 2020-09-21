import React from "react"
import { Card, CardHeader, CardBody, CardFooter } from "../Card"
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
      title="This is a demo card title"
      dense={boolean("header dense", false)}
    />
    <CardBody dense={boolean("body dense", false)}>
      This is the card body
    </CardBody>
    <CardFooter dense={boolean("footer dense", false)}>
      This is the card footer
    </CardFooter>
  </Card>
)
