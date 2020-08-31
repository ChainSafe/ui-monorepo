import React from "react"
import { action } from "@storybook/addon-actions"
import { withKnobs } from "@storybook/addon-knobs"
import Breadcrumb from "../Breadcrumb"

export default {
  title: "Breadcrumb",
  component: Breadcrumb,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  linkClick: action("Clicked link"),
  homeClicked: action("Clicked link"),
}

export const BreadcrumbStory = (): React.ReactNode => (
  <Breadcrumb
    homeOnClick={() => actionsData.homeClicked()}
    crumbs={[
      {
        text: "Level 1 - Clickable",
        onClick: () => actionsData.linkClick(),
      },
      {
        text: "Level 2",
      },
    ]}
  />
)
