import React from "react"
import { withKnobs, select, boolean } from "@storybook/addon-knobs"
import Avatar from "../Avatar/Avatar"
import { Typography } from "../Typography"
import { UserIcon } from "../Icons"

export default {
  title: "Avatar",
  component: Avatar,
  decorators: [withKnobs],
}

export const IconDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
    cover={boolean("Cover", false)}
  >
    <UserIcon />
  </Avatar>
)

export const TextDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
    cover={boolean("Cover", false)}
  >
    <Typography>U</Typography>
  </Avatar>
)

export const ImageDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
    cover={boolean("Cover", false)}
  >
    <img src="http://placekitten.com/200/200" />
  </Avatar>
)
