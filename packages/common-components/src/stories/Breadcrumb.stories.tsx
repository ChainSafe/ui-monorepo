import React from "react"
import { action } from "@storybook/addon-actions"
import { withKnobs } from "@storybook/addon-knobs"
import { Breadcrumb } from ".."

export default {
  title: "Breadcrumb",
  component: Breadcrumb,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  onClick: action("onClickButton"),
}

export const ButtonStory = (): React.ReactNode => (
  <Breadcrumb
    homeOnClick={() => alert("Home clicked")}
    crumbs={[
      {
        text: "Level 1 - Clickable",
        onClick: () => alert("Clicked"),
      },
      {
        text: "Level 2",
      },
    ]}
    {...actionsData}
  />
)
