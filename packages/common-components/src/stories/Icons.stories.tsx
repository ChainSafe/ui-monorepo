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

export const CustomDemo = (): React.ReactNode => (
  <SvgIcon fill="orange" fontSize="large">
    <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </SvgIcon>
)
