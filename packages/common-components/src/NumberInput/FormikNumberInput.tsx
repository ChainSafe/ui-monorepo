import React, { ReactElement } from "react"
import { useField } from "formik"
import NumberInput from "./NumberInput"

export interface FormikNumberInputProps {
  className?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  name: string
  inputVariant?: "default" | "minimal"
  size?: "large" | "medium" | "small"
  captionMessage?: string
  labelClassName?: string

  prefixCls?: string
  min?: number
  max?: number
  step?: number | string
  precision?: number
  focusOnUpDown?: boolean
  required?: boolean
  autoFocus?: boolean
  readOnly?: boolean
  id?: string
  defaultValue?: number
  onBlur?: (value: number | string | undefined) => void
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus?: (value: number | string | undefined) => void
  upHandler?: ReactElement
  downHandler?: ReactElement
  formatter?: (value: number | string | undefined) => string
  parser?: (displayValue: string | undefined) => number
  pattern?: string
  decimalSeparator?: string
  inputMode?: string
}

const FormikNumberInput: React.FC<FormikNumberInputProps> = ({
  className,
  inputVariant = "default",
  placeholder,
  name,
  size,
  label,
  labelClassName,
  disabled = false,
  captionMessage,
}: FormikNumberInputProps) => {
  const [field, meta, helpers] = useField(name)
  return (
    <NumberInput
      label={label ? label : field.name}
      inputVariant={inputVariant}
      disabled={disabled}
      size={size}
      className={className}
      labelClassName={labelClassName}
      name={field.name}
      value={field.value}
      placeholder={placeholder}
      captionMessage={
        meta.error ? `${meta.error}` : captionMessage && captionMessage
      }
      state={meta.error ? "error" : undefined}
      onChange={helpers.setValue}
    />
  )
}

export default FormikNumberInput
