import React from "react"
import { useField } from "formik"
import RadioInput from "./RadioInput"

interface IFormikRadioInputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  name: string
  label?: string
  id: string
}

const FormikRadioInput: React.FC<IFormikRadioInputProps> = ({
  name,
  onChange,
  id,
  label,
  ...props
}) => {
  const [field, meta, helpers] = useField<string>(name)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(id)
    onChange && onChange(event)
  }

  return (
    <RadioInput
      name={name}
      onChange={handleChange}
      error={meta.error}
      {...props}
      value={id}
      checked={field.value === id}
      label={label}
    />
  )
}

export default FormikRadioInput
