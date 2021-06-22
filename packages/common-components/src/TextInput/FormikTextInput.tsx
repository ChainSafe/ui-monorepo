import React from "react"
import { useField } from "formik"
import TextInput, { ITextInputProps } from "./TextInput"

export interface FormikTextInputProps
  extends Omit<ITextInputProps, "onChange" | "state" | "value"> {
  name: string
  hideLabel?: boolean
}

const FormikTextInput = React.forwardRef(
  (
    {
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
      hideLabel,
      ...rest
    }: FormikTextInputProps,
    forwardedRef: any
  ) => {
    const [field, meta, helpers] = useField(name)
    return (
      <TextInput
        label={hideLabel ? undefined : label || field.name}
        inputVariant={inputVariant}
        disabled={disabled}
        type={type}
        size={size}
        className={className}
        labelClassName={labelClassName}
        name={field.name}
        value={field.value}
        placeholder={placeholder}
        captionMessage={meta.error || captionMessage}
        state={meta.error ? "error" : undefined}
        onChange={helpers.setValue}
        autoFocus={autoFocus}
        ref={forwardedRef}
        {...rest}
      />
    )
  }
)

FormikTextInput.displayName = "FormikTextInput"

export default FormikTextInput
