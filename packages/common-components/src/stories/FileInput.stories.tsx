import React, { useState } from "react"
import { action } from "@storybook/addon-actions"
import { Formik, Form } from "formik"
import { withKnobs, boolean, number, select } from "@storybook/addon-knobs"
import { Button } from "../Button"
import { FileInput } from "../FileInput"

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

export const Default = (): React.ReactNode => {
  const [fileNumber, setFileNumber] = useState(0)

  return (
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
          onFileNumberChange={setFileNumber}
          label="Drag or click to upload files"
          moreFilesLabel="Add more files"
        />
        <Button type="submit">Submit {fileNumber}</Button>
      </Form>
    </Formik>
  )
}
