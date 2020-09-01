import React from "react"
import { action } from "@storybook/addon-actions"
import { FileInput } from "../FileInput"
import { Formik, Form } from "formik"
import Button from "../Button"
import { withKnobs, boolean, number, select } from "@storybook/addon-knobs"

export default {
  title: "FileInput",
  component: FileInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const actionsData = {
  onFormSubmit: action("FormSubmit"),
}

const acceptOptions = [
  "",
  "image/*",
  "audio/*",
  "application/*",
  ".pdf",
  ".jpg",
]

export const Default = (): React.ReactNode => (
  <Formik
    initialValues={{
      uploadedFiles: [],
    }}
    onSubmit={(values) => actionsData.onFormSubmit(values)}
  >
    <Form>
      <FileInput
        name="uploadedFiles"
        variant={select("Variant", ["dropzone", "filepicker"], "dropzone")}
        multiple={boolean("multiple", true)}
        minSize={number("Minimum File Size", 0)}
        maxSize={number("Maximum File Size", 1024 * 100)}
        accept={select("Accept File Type", acceptOptions, "")}
      />
      <Button type="submit">Submit</Button>
    </Form>
  </Formik>
)
