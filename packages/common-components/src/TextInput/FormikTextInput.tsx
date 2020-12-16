import React from "react"
import { useField } from "formik"
import TextInput, { ITextInputProps } from "./TextInput"

export interface FormikTextInputProps
  extends Omit<ITextInputProps, "onChange" | "state" | "value"> {
  name: string
  inputVariant?: "default" | "minimal"
  type?: "text" | "email" | "password" | "url" | "search"
  size?: "large" | "medium" | "small"
  captionMessage?: string
  labelClassName?: string
  autoFocus?: boolean
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({
  className,
  inputVariant = "default",
  type = "text",
  placeholder,
  name,
  size,
  label,
  labelClassName,
  disabled = false,
  autoFocus,
  captionMessage,
  ...rest
}: FormikTextInputProps) => {
  const [field, meta, helpers] = useField(name)
  return (
    <TextInput
      label={label ? label : field.name}
      inputVariant={inputVariant}
      disabled={disabled}
      type={type}
      size={size}
      className={className}
      labelClassName={labelClassName}
      name={field.name}
      value={field.value}
      placeholder={placeholder}
      captionMessage={
        meta.touched && meta.error
          ? `${meta.error}`
          : captionMessage && captionMessage
      }
      state={meta.error ? "error" : undefined}
      onChange={helpers.setValue}
      autoFocus={autoFocus}
    />
  )
}

export default FormikTextInput
