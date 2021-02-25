import React, { useState } from "react"
import { boolean, text, withKnobs } from "@storybook/addon-knobs"
import { RadioInput, FormikRadioInput } from "../RadioInput"
import { Formik, Form } from "formik"
import { action } from "@storybook/addon-actions"
import { Button } from "../Button"

export default {
  title: "RadioInput",
  component: RadioInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

export const Default = (): React.ReactNode => {
  const [value, setValue] = useState("apple")
  return (
    <>
      <RadioInput
        label={text("label", "Apple")}
        value="apple"
        onChange={(e) => setValue(e.target.value)}
        checked={value === "apple"}
      />
      <RadioInput
        label="Orange"
        value="orange"
        onChange={(e) => setValue(e.target.value)}
        checked={value === "orange"}
      />
      <RadioInput
        label="Grape"
        value="grape"
        onChange={(e) => setValue(e.target.value)}
        disabled={boolean("disabled", false)}
        checked={value === "grape"}
      />
    </>
  )
}

export const actionsData = {
  onFormSubmit: action("Submit Form")
}

export const FormikStory = (): React.ReactNode => {
  return (
    <Formik
      initialValues={{
        fruits: "apple"
      }}
      onSubmit={(values: any) => actionsData.onFormSubmit(values)}
    >
      <Form>
        <FormikRadioInput
          name="fruits"
          label="Apple"
          disabled={boolean("Disabled", false)}
          id="apple"
        />
        <FormikRadioInput
          name="fruits"
          label="Orange"
          disabled={boolean("Disabled", false)}
          id="orange"
        />
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}
