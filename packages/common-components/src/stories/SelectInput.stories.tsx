import React from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"
import { Formik, Form } from "formik"
import { Button } from "../Button"
import { FormikSelectInput, SelectInput } from "../SelectInput"
import SelectOption from "../SelectInput/SelectOption"

export default {
  title: "Select Input",
  component: SelectInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

const sizeOptions: ["large", "medium", "small"] = ["large", "medium", "small"]

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
    options={[{ label: "a" }, { label: "b" }]}
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
        <FormikSelectInput name="select">
          <SelectOption label="a" />
          <SelectOption label="b" />
        </FormikSelectInput>
        <br />
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}
