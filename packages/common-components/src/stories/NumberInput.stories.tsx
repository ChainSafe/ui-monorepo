import React from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { BulbIcon } from "../Icons"
import { action } from "@storybook/addon-actions"
import { HomeIcon } from "../Icons"
import { Button } from "../Button"
import { FormikNumberInput, NumberInput } from "../NumberInput"
import { InputState } from "../TextInput"
import { Form, Formik } from "formik"

export default {
  title: "NumberInput",
  component: NumberInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

const inputStateOptions: InputState[] = [
  "error",
  "normal",
  "success",
  "warning"
]

type SizeOption = "large" | "medium" | "small"
const sizeOptions: SizeOption[] = ["large", "medium", "small"]

export const actionsData = {
  onChange: action("onChange"),
  onFormSubmit: action("Submit Form")
}

export const NoIconStory = (): React.ReactNode => (
  <NumberInput
    onChange={() => actionsData.onChange()}
    state={select("State", inputStateOptions, "normal")}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
  />
)

export const LeftIconStory = (): React.ReactNode => (
  <NumberInput
    onChange={() => actionsData.onChange()}
    LeftIcon={HomeIcon}
    state={select("State", inputStateOptions, "normal")}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
  />
)

export const RightIconStory = (): React.ReactNode => (
  <NumberInput
    onChange={() => actionsData.onChange()}
    RightIcon={BulbIcon}
    state={select("State", inputStateOptions, "normal")}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
  />
)

export const BothIconsStory = (): React.ReactNode => (
  <NumberInput
    onChange={() => actionsData.onChange()}
    LeftIcon={HomeIcon}
    RightIcon={BulbIcon}
    state={select("State", inputStateOptions, "normal")}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testin Label")}
    placeholder={text("Placeholder", "Placeholder text")}
    captionMessage={text("Caption/Error text", "Generic caption area")}
  />
)

export const FormikStory = (): React.ReactNode => {
  return (
    <Formik
      initialValues={{
        text: "Initial value of form field"
      }}
      onSubmit={(values: any) => actionsData.onFormSubmit(values)}
    >
      <Form>
        <FormikNumberInput
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
