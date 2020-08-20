import React from "react"
import SvgIcon, { AddCircleIcon, AlarmClockIcon } from "../Icons"
import { withKnobs, select } from "@storybook/addon-knobs"

export default {
  title: "Icon",
  component: SvgIcon,
  decorators: [withKnobs],
}

const colorOptions: colorProp[] = ["primary", "secondary", "error", "success"]
const fontSizeOptions: fontSizeProp[] = ["small", "medium", "large"]

export const MainDemo = (): React.ReactNode => (
  <AddCircleIcon
    color={select("color", colorOptions, "primary")}
    fontSize={select("font size", fontSizeOptions, "medium")}
  />
)

export const ColorDemo = (): React.ReactNode => (
  <AlarmClockIcon fill="orange" fontSize="large" />
)
