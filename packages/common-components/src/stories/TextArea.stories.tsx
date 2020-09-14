import React from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { TextArea, InputState } from "../TextArea"

export default {
  title: "TextArea",
  component: TextArea,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

const inputStateOptions: InputState[] = [
  "error",
  "normal",
  "success",
  "warning",
]

const sizeOptions: ["large", "medium", "small"] = ["large", "medium", "small"]

export const NoIconStory = (): React.ReactNode => (
  <TextArea
    state={select("State", inputStateOptions, "normal")}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testing Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
  />
)
