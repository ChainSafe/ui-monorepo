import React from "react"
import Button from "../Button"
import { action } from "@storybook/addon-actions"

export default {
  title: "Button story",
  component: Button,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action("onClickButton"),
}

export const Default = (): React.ReactNode => (
  <Button {...actionsData}>Storybook Button</Button>
)

export const Disabled = (): React.ReactNode => (
  <Button {...actionsData} disabled>
    Disabled button
  </Button>
)
