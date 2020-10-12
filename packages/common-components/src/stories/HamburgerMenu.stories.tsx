import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { HamburgerMenu } from "../HamburgerMenu"
import { action } from "@storybook/addon-actions"

export default {
  title: "HamburgerMenu",
  component: HamburgerMenu,
  decorators: [withKnobs],
}

export const actionsData = {
  onClick: action("onClickButton"),
}

export const HamburgerMenuDemo = (): React.ReactNode => {
  return (
    <HamburgerMenu
      onClick={actionsData.onClick}
      variant={select("variant", ["default", "active"], "default")}
    />
  )
}
