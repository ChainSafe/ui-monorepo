import React from "react"
import { withKnobs, select, text } from "@storybook/addon-knobs"
import Avatar from "../Avatar/Avatar"
import { Typography } from "../Typography"
import { UserIcon } from "../Icons"
import { Blockies } from "../Blockies"

export default {
  title: "Avatar",
  component: Avatar,
  decorators: [withKnobs],
}

export const BlockiesDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
  >
    <Blockies seed={text("Blockie seed", "Cats")} />
  </Avatar>
)

export const IconDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
  >
    <UserIcon />
  </Avatar>
)

export const TextDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
  >
    <Typography>U</Typography>
  </Avatar>
)

export const ImageDemo = (): React.ReactNode => (
  <Avatar
    size={select("Size", ["small", "medium", "large"], "medium")}
    variant={select("Variant", ["circle", "square"], "circle")}
  >
    <img src="http://placekitten.com/200/200" />
  </Avatar>
)
