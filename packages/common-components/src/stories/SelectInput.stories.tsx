import React, { Fragment } from "react"
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"
import { Formik, Form } from "formik"
import { Button } from "../Button"
import { SelectInput, FormikSelectInput } from "../SelectInput"
import { BulbIcon } from "../Icons"
import { Typography } from "../Typography"

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
    onChange={(value: any) => actionsData.onChange(value)}
    size={select("Size", sizeOptions, "large")}
    disabled={boolean("Disabled", false)}
    label={text("Label", "Testing Label")}
    options={[
      {
        label: (
          <Fragment>
            <BulbIcon /> <Typography>Custom markup</Typography>
          </Fragment>
        ),
        value: "4",
      },
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
            {
              label: (
                <Fragment>
                  <BulbIcon /> <Typography>Custom markup</Typography>
                </Fragment>
              ),
              value: "4",
            },
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
