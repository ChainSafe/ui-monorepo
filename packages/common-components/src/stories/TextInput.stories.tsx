import React from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { BulbIcon } from "../Icons"
import { action } from "@storybook/addon-actions"
import { HomeIcon } from "../Icons"
import { TextInput, FormikTextInput, InputState } from "../TextInput"
import { Formik, Form } from "formik"
import { Button } from "../Button"

export default {
  title: "TextInput",
  component: TextInput,
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
const typeOptions: ["text", "email", "password", "url", "search", "number"] = [
  "text",
  "email",
  "password",
  "url",
  "search",
  "number",
]

export const actionsData = {
  onChange: action("onChange"),
  onFormSubmit: action("Submit Form"),
}

export const NoIconStory = (): React.ReactNode => (
  <TextInput
    onChange={() => actionsData.onChange()}
    state={select("State", inputStateOptions, "normal")}
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
    state={select("State", inputStateOptions, "normal")}
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
    state={select("State", inputStateOptions, "normal")}
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
    state={select("State", inputStateOptions, "normal")}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
    type={select("Type", typeOptions, "text")}
  />
)

export const FormikStory = (): React.ReactNode => {
  return (
    <Formik
      initialValues={{
        text: "Initial value of form field",
      }}
      onSubmit={(values: any) => actionsData.onFormSubmit(values)}
    >
      <Form>
        <FormikTextInput
          name="text"
          label={text("Label", "Testin Label")}
          placeholder={text("Placeholder", "Placeholder text")}
          size={select("Size", sizeOptions, "large")}
          captionMessage={text("Caption/Error text", "Generic caption area")}
          disabled={boolean("Disabled", false)}
        />
        <br />
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}
