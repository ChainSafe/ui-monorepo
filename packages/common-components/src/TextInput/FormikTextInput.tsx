import React, { ChangeEvent } from "react"
import { useField } from "formik"
import TextInput from "./TextInput"

export interface FormikTextInputProps {
  className?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  name: string
  type?: "text" | "email" | "password" | "url" | "search"
  size?: "large" | "medium" | "small"
  captionMessage?: string
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({
  className,
  type = "text",
  placeholder,
  name,
  size,
  label,
  disabled = false,
  captionMessage,
}: FormikTextInputProps) => {
  const [field, meta, helpers] = useField(name)
  console.log("field", field)
  console.log("meta", meta)
  console.log("helpers", helpers)
  return (
    <TextInput
      label={label ? label : field.name}
      disabled={disabled}
      type={type}
      size={size}
      className={className}
      name={field.name}
      value={field.value}
      placeholder={placeholder}
      captionMessage={
        meta.error ? `${meta.error}` : captionMessage && captionMessage
      }
      state={meta.error ? "error" : undefined}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        helpers.setValue(e.target?.value)
      }}
    />
  )
}

export default FormikTextInput
