/**
 *
 * TextInput
 *
 */

import React, { ChangeEvent } from "react"
import { useField } from "formik"
import TextInput from "./TextInput"

interface OwnProps {
  className?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  name: string
  type?: "text" | "email" | "password" | "url" | "search"
}

const FormikTextInput: React.SFC<OwnProps> = ({
  className,
  type = "text",
  placeholder,
  disabled = false,
}: OwnProps) => {
  const [field, meta, helpers] = useField(name)
  return (
    <TextInput
      label={field.name}
      disabled={disabled}
      type={type}
      className={className}
      name={field.name}
      value={field.value}
      placeholder={placeholder}
      captionMessage={meta.error && `${meta.error}`}
      state={meta.error ? "error" : undefined}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        helpers.setValue(e.target?.value)
      }}
    />
  )
}

export default FormikTextInput
