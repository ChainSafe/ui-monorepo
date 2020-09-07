import React from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"
import { Formik, Form } from "formik"
import { Button } from "../Button"
import { SelectInput, FormikSelectInput } from "../SelectInput"

export default {
  title: "Select Input",
  component: SelectInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

const sizeOptions: Array<"large" | "medium" | "small"> = [
  "large",
  "medium",
  "small",
]

export const actionsData = {
  onChange: action("onChange"),
  onFormSubmit: action("Submit Form"),
}

export const SelectInputStory = (): React.ReactNode => (
  <SelectInput
    onChange={() => actionsData.onChange()}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testing Label")}
    options={[
      { label: "a", value: "a" },
      { label: "b", value: "b" },
      { label: "c", value: "c" },
    ]}
  />
)

export const FormikStory = (): React.ReactNode => {
  return (
    <Formik
      initialValues={{
        select: undefined,
      }}
      onSubmit={(values: any) => actionsData.onFormSubmit(values)}
    >
      <Form>
        <FormikSelectInput
          name="select"
          options={[
            { label: "a", value: "a" },
            { label: "b", value: "b" },
            { label: "c", value: "c" },
          ]}
        />
        <br />
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}
