import React from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { BulbIcon } from "../Icons"
import { INPUT_STATE, TextInput } from "../TextInput"
import { action } from "@storybook/addon-actions"
import { HomeIcon } from "../Icons"

export default {
  title: "TextInput",
  component: TextInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

const inputStateOptions: [
  INPUT_STATE.NORMAL,
  INPUT_STATE.ERROR,
  INPUT_STATE.SUCCESS,
  INPUT_STATE.WARNING,
] = [
  INPUT_STATE.NORMAL,
  INPUT_STATE.ERROR,
  INPUT_STATE.SUCCESS,
  INPUT_STATE.WARNING,
]

const sizeOptions: ["large", "medium", "small"] = ["large", "medium", "small"]
const typeOptions: ["text", "email", "password", "url", "search"] = [
  "text",
  "email",
  "password",
  "url",
  "search",
]

export const actionsData = {
  onChange: action("onChange"),
}

export const NoIconStory = (): React.ReactNode => (
  <TextInput
    onChange={() => actionsData.onChange()}
    state={select("State", inputStateOptions, INPUT_STATE.NORMAL)}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
    type={select("Type", typeOptions, "text")}
  />
)

export const LeftIconStory = (): React.ReactNode => (
  <TextInput
    onChange={() => actionsData.onChange()}
    LeftIcon={HomeIcon}
    state={select("State", inputStateOptions, INPUT_STATE.NORMAL)}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
    type={select("Type", typeOptions, "text")}
  />
)

export const RightIconStory = (): React.ReactNode => (
  <TextInput
    onChange={() => actionsData.onChange()}
    RightIcon={BulbIcon}
    state={select("State", inputStateOptions, INPUT_STATE.NORMAL)}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
    type={select("Type", typeOptions, "text")}
  />
)

export const BothIconsStory = (): React.ReactNode => (
  <TextInput
    onChange={() => actionsData.onChange()}
    LeftIcon={HomeIcon}
    RightIcon={BulbIcon}
    state={select("State", inputStateOptions, INPUT_STATE.NORMAL)}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
    type={select("Type", typeOptions, "text")}
  />
)
