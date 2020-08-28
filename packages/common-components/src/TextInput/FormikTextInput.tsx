/**
 *
 * TextInput
 *
 */

import React, { ChangeEvent } from "react"
import { FieldProps } from "formik"
import TextInput, { INPUT_STATE } from "./TextInput"

interface OwnProps extends FieldProps {
  className?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  type?: "text" | "email" | "password" | "url" | "search"
}

const FormikTextInput: React.SFC<OwnProps> = ({
  className,
  field,
  form: { errors, setFieldValue },
  // label = field.name,
  type = "text",
  placeholder,
  disabled = false,
}: OwnProps) => {
  const error = errors[field.name]
  return (
    <TextInput
      label={field.name}
      disabled={disabled}
      type={type}
      className={className}
      name={field.name}
      value={field.value}
      placeholder={placeholder}
      captionMessage={error && `${error}`}
      state={error ? INPUT_STATE.ERROR : undefined}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setFieldValue(field.name, e.target?.value)
      }}
    />
  )
}

export default FormikTextInput
