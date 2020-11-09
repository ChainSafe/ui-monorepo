import React from "react"
import { useField } from "formik"
import RadioInput from "./RadioInput"

interface IFormikCheckboxProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  name: string
  label?: string
  checked?: boolean
  id: string
}

const FormikCheckboxInput: React.FC<IFormikCheckboxProps> = ({
  name,
  onChange,
  checked,
  id,
  ...props
}) => {
  const [field, meta, helpers] = useField<string>(name)

  const handleChange = () => {
    helpers.setValue(id)
  }

  return (
    <RadioInput
      name={name}
      onChange={handleChange}
      error={meta.error}
      {...props}
      value={id}
      checked={field.value === id}
    />
  )
}

export default FormikCheckboxInput

export { IFormikCheckboxProps }
