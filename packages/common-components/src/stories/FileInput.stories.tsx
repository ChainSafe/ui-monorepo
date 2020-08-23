import React from "react"
import { action } from "@storybook/addon-actions"
import FileInput from "../FileInput"
import { Formik, Form } from "formik"
import Button from "../Button"

export default {
  title: "FileInput",
  component: FileInput,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onFormSubmit: action("FormSubit", { allowFunction: true }),
}

export const Default = (): React.ReactNode => (
  <Formik
    initialValues={{
      uploadedFiles: [],
    }}
    onSubmit={values => actionsData.onFormSubmit(values)}
  >
    <Form>
      <FileInput name="uploadedFiles" />
      <Button type="submit">Submit</Button>
    </Form>
  </Formik>
)
