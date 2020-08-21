import React from "react"
import SvgIcon, { Bulb } from "../Icons"
import { withKnobs, select } from "@storybook/addon-knobs"
import { ReactComponent as BulbSvg } from "../Icons/svgs/bulb.svg"

export default {
  title: "Icon",
  component: SvgIcon,
  decorators: [withKnobs],
}

const colorOptions: colorProp[] = ["primary", "secondary", "error", "success"]
const fontSizeOptions: fontSizeProp[] = ["small", "medium", "large"]

export const MainDemo = (): React.ReactNode => (
  <Bulb
    color={select("color", colorOptions, "primary")}
    fontSize={select("font size", fontSizeOptions, "medium")}
  />
)

export const CustomSvgIcon = (): React.ReactNode => (
  <SvgIcon>
    <BulbSvg />
  </SvgIcon>
)
