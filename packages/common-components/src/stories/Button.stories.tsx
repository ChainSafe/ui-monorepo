import React from "react"
import { action } from "@storybook/addon-actions"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { Button } from "../Button"
import { BulbIcon } from "../Icons"

export default {
  title: "Button",
  component: Button,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

export const actionsData = {
  onClick: action("onClickButton")
}

type VariantOption = "primary" | "outline" | "dashed" | "danger" | undefined;
const variantOptions: VariantOption[] = [
  "primary",
  "outline",
  "dashed",
  "danger",
  undefined
]

type SizeOptions = "large" | "medium" | "small" | undefined
const sizeOptions: SizeOptions[] = [
  "large",
  "medium",
  "small",
  undefined
]

export const ButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, "primary")}
    size={select("Size", sizeOptions, "large")}
    iconButton={false}
    fullsize={boolean("Fullsize", false)}
    disabled={boolean("Disabled", false)}
    loading={boolean("Loading", false)}
    loadingText={text("Loading Text", "Loading")}
  >
    <span>Standard button</span>
  </Button>
)

export const IconLeftButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, "primary")}
    size={select("Size", sizeOptions, "large")}
    iconButton={false}
    fullsize={boolean("Fullsize", false)}
    disabled={boolean("Disabled", false)}
    loading={boolean("Loading", false)}
    loadingText={text("Loading Text", "Loading")}
  >
    <BulbIcon />
    <span>Standard button</span>
  </Button>
)

export const IconRightButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, "primary")}
    size={select("Size", sizeOptions, "large")}
    iconButton={false}
    fullsize={boolean("Fullsize", false)}
    disabled={boolean("Disabled", false)}
    loading={boolean("Loading", false)}
    loadingText={text("Loading Text", "Loading")}
  >
    <span>Standard button</span>
    <BulbIcon />
  </Button>
)

export const IconButtonStory = (): React.ReactNode => (
  <Button
    {...actionsData}
    variant={select("Variant", variantOptions, "primary")}
    size={select("Size", sizeOptions, "large")}
    iconButton={true}
    fullsize={boolean("Fullsize", false)}
    disabled={boolean("Disabled", false)}
    loading={boolean("Loading", false)}
    loadingText={text("Loading Text", "Loading")}
  >
    <BulbIcon />
  </Button>
)
