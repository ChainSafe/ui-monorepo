import React from "react"
import Button from "../Button"
import { action } from "@storybook/addon-actions"

export default {
  title: "Button",
  component: Button,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action("onClickButton"),
}

export const Default = (): React.ReactNode => (
  <Button {...actionsData}>Storybook Button</Button>
)
