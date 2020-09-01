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
      testCheckbox: false,
    }}
    onSubmit={(values) => actionsData.onFormSubmit(values)}
  >
    <Form>
      <CheckboxInput name="testCheckbox" label="Test Checkbox" />
      <br />
      <Button type="submit">Submit</Button>
    </Form>
  </Formik>
)
