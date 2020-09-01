import React, { useState } from "react"
import { action } from "@storybook/addon-actions"
import { withKnobs, boolean, text } from "@storybook/addon-knobs"
import { CheckboxInput, FormikCheckboxInput } from "../CheckboxInput"
import { Formik, Form } from "formik"
import Button from "../Button"

export default {
  title: "CheckboxInput",
  component: CheckboxInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  onToggle: action("Toggle Checkbox"),
  onFormSubmit: action("Submit Form"),
}

export const Default = (): React.ReactNode => {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
    actionsData.onToggle(!checked)
  }

  return (
    <>
      <CheckboxInput
        label={text("Label", "Test Label")}
        value={checked}
        onChange={handleChange}
        disabled={boolean("Disabled", false)}
      />
    </>
  )
}

export const FormikStory = (): React.ReactNode => {
  return (
    <Formik
      initialValues={{
        checkbox: false,
      }}
      onSubmit={(values: any) => actionsData.onFormSubmit(values)}
    >
      <Form>
        <FormikCheckboxInput
          name="checkbox"
          label={text("Label", "Test Label")}
          disabled={boolean("Disabled", false)}
        />
        <br />
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}
