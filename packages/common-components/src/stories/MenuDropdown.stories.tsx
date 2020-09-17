import React from "react"
import { withKnobs, text } from "@storybook/addon-knobs"
import { MenuDropdown } from "../MenuDropdown"
import { action } from "@storybook/addon-actions"

export default {
  title: "Menu-Dropdown",
  component: MenuDropdown,
  decorators: [withKnobs],
}

const actionsData = {
  onClick: action("onClickButton"),
}

export const MenuDropdownDemo = (): React.ReactNode => (
  <div
    style={{
      width: 120,
    }}
  >
    <MenuDropdown
      title={text("title", "cat@gmail.com")}
      menuItems={[
        {
          title: "Item 1",
          onClick: actionsData.onClick,
        },
        {
          title: "Item 2",
          onClick: actionsData.onClick,
        },
      ]}
    />
  </div>
)
