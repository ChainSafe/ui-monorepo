import React from "react"
import SvgIcon, { HomeIcon } from "../Icons"
import { withKnobs, select } from "@storybook/addon-knobs"
import { ReactComponent as HomeSvg } from "../Icons/svgs/home.svg"

export default {
  title: "Icon",
  component: SvgIcon,
  decorators: [withKnobs],
}

const colorOptions: colorProp[] = ["primary", "secondary", "error", "success"]
const fontSizeOptions: fontSizeProp[] = ["small", "medium", "large"]

export const MainDemo = (): React.ReactNode => (
  <HomeIcon
    color={select("color", colorOptions, "primary")}
    fontSize={select("font size", fontSizeOptions, "medium")}
  />
)

export const CustomSvgIcon = (): React.ReactNode => (
  <SvgIcon>
    <HomeSvg />
  </SvgIcon>
)
