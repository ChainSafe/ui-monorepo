import React from "react"
import { action } from "@storybook/addon-actions"
import { boolean, withKnobs, text, number } from "@storybook/addon-knobs"
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

const crumbs = [
  {
    text: text("breadcrumb 2", "Level 1 Clickable"),
    onClick: () => actionsData.linkClick(),
    active: boolean("breadcrumb-2-active", false)
  },
  {
    text: "Level 2"
  },
  {
    text: "Level 3"
  },
  {
    text: "Level 4"
  },
  {
    text: "Level 5"
  },
  {
    text: "Level 6"
  }
]

export const BreadcrumbWithDropdown = (): React.ReactNode => {

  return (
    <>
      <Breadcrumb
        homeOnClick={() => actionsData.homeClicked()}
        homeActive={boolean("home-active", false)}
        showDropDown
        crumbs={crumbs}
        hideHome={boolean("hide home", false)}
        maximumCrumbs={number("maximum crumbs", 3)}

      />
    </>
  )}

export const Breadcrumbs = (): React.ReactNode => {
  return (
    <>
      <Breadcrumb
        homeOnClick={() => actionsData.homeClicked()}
        homeActive={boolean("home-active", false)}
        crumbs={crumbs}
        hideHome={boolean("hide home", false)}
      />
    </>
  )}
