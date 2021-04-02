import React from "react"
import { action } from "@storybook/addon-actions"
import { boolean, withKnobs, text } from "@storybook/addon-knobs"
import { Breadcrumb } from "../Breadcrumb"

export default {
  title: "Breadcrumb",
  component: Breadcrumb,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

export const actionsData = {
  linkClick: action("Clicked link"),
  homeClicked: action("Clicked link")
}

export const BreadcrumbStory = (): React.ReactNode => (
  <>
    <Breadcrumb
      homeOnClick={() => actionsData.homeClicked()}
      showDropDown={boolean("show dropdown", true)}
      crumbs={[
        {
          text: text("breadcrumb 2", "Level 1 Clickable"),
          onClick: () => actionsData.linkClick()
        },
        {
          text: "Level 2"
        },
        {
          text: "Level 3"
        },
        {
          text: "Level 4"
        }
      ]}
    />
  </>
)
