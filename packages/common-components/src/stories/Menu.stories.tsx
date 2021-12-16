import React from "react"
import { withKnobs  } from "@storybook/addon-knobs"
import { Menu } from "../Menu"
import { DownloadIcon, MoreIcon } from "../Icons"

export default {
  title: "Menu",
  component: Menu,
  decorators: [withKnobs]
}

const menuItems = [
  {
    contents: (
      <>
        <DownloadIcon  />
        <span >
          Download
        </span>
      </>
    ),
    onClick: () => undefined
  }
]

export const MenuDefault = (): React.ReactNode => (
  <Menu
    testId='preview-kebab'
    icon={<MoreIcon />}
    options={menuItems}
  />
)

