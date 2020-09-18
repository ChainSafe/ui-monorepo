import React, { Fragment } from "react"
import { withKnobs, text } from "@storybook/addon-knobs"
import { MenuDropdown } from "../MenuDropdown"
import { action } from "@storybook/addon-actions"
import { Typography } from "../Typography"
import { HomeIcon } from "../Icons"

export default {
  title: "Menu-Dropdown",
  component: MenuDropdown,
  decorators: [withKnobs],
}

const actionsData = {
  onClick: action("onClickButton"),
}

export const MenuDropdownDemo = (): React.ReactNode => (
  <div style={{ paddingLeft: 50, paddingTop: 10 }}>
    <div>
      Note: Story has added padding to display the menu without cutting off
    </div>
    <MenuDropdown
      title={text("title", "cat@gmail.com")}
      menuItems={[
        {
          contents: <Typography>Potate</Typography>,
          onClick: actionsData.onClick,
        },
        {
          contents: (
            <Fragment>
              <HomeIcon />
              <Typography>Nandos</Typography>
            </Fragment>
          ),
          onClick: actionsData.onClick,
        },
      ]}
    />
  </div>
)
