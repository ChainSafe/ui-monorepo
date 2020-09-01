import React from "react"
import { action } from "@storybook/addon-actions"
import { Formik, Form } from "formik"
import Button from "../Button"
import { withKnobs } from "@storybook/addon-knobs"
import CheckboxInput from "../CheckboxInput"

export default {
  title: "CheckboxInput",
  component: CheckboxInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  onFormSubmit: action("FormSubit"),
}

export const Default = (): React.ReactNode => (
  <Formik
    initialValues={{
      checkbox1: false,
      checkbox2: false,
      checkbox3: true,
    }}
    onSubmit={(values) => actionsData.onFormSubmit(values)}
  >
    <Form>
      <CheckboxInput name="checkbox1" label="Checkbox" />
      <br />
      <CheckboxInput name="checkbox2" label="Checkbox" disabled />
      <br />
      <CheckboxInput name="checkbox3" label="Checkbox" disabled />
      <br />
      <Button type="submit">Submit</Button>
    </Form>
  </Formik>
)
