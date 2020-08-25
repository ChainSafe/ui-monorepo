import React from "react"
import Button from "../Button"
import { action } from "@storybook/addon-actions"
import { withKnobs, select } from "@storybook/addon-knobs"

export default {
  title: "Button",
  component: Button,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  onClick: action("onClickButton"),
}

const variantOptions: ["primary", "secondary", "tertiary", undefined] = [
  "primary",
  "secondary",
  "tertiary",
  undefined,
]
const sizeOptions: ["large", "medium", "small", undefined] = [
  "large",
  "medium",
  "small",
  undefined,
]
const disabledOptions: [boolean, boolean, undefined] = [true, false, undefined]
const fullsizeOptions: [boolean, boolean, undefined] = [true, false, undefined]

export const ButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, undefined)}
    size={select("Size", sizeOptions, undefined)}
    fullsize={select("Fullsize", fullsizeOptions, undefined)}
    disabled={select("Disabled", disabledOptions, undefined)}
  >
    Standard button
  </Button>
)
