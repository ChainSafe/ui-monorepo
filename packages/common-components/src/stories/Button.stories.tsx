import React from "react"
import Button from "../Button"
import { action } from "@storybook/addon-actions"
import { withKnobs, select } from "@storybook/addon-knobs"
import { Bulb } from "../Icons"

export default {
  title: "Button",
  component: Button,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  onClick: action("onClickButton"),
}

const variantOptions: ["primary", "outline", "dashed", "danger", undefined] = [
  "primary",
  "outline",
  "dashed",
  "danger",
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
    iconButton={false}
    fullsize={select("Fullsize", fullsizeOptions, undefined)}
    disabled={select("Disabled", disabledOptions, undefined)}
  >
    Standard button
  </Button>
)

export const IconLeftButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, undefined)}
    size={select("Size", sizeOptions, undefined)}
    iconButton={false}
    fullsize={select("Fullsize", fullsizeOptions, undefined)}
    disabled={select("Disabled", disabledOptions, undefined)}
  >
    <Bulb />
    Standard button
  </Button>
)

export const IconRightButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, undefined)}
    size={select("Size", sizeOptions, undefined)}
    iconButton={false}
    fullsize={select("Fullsize", fullsizeOptions, undefined)}
    disabled={select("Disabled", disabledOptions, undefined)}
  >
    Standard button
    <Bulb />
  </Button>
)

export const IconButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, undefined)}
    size={select("Size", sizeOptions, undefined)}
    iconButton={true}
    fullsize={select("Fullsize", fullsizeOptions, undefined)}
    disabled={select("Disabled", disabledOptions, undefined)}
  >
    <Bulb />
  </Button>
)
