import React, { ReactNode } from "react"
import { useField } from "formik"
import CheckboxInput from "./CheckboxInput"

interface IFormikCheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  className?: string
  name: string
  label?: string | ReactNode
}

const FormikCheckboxInput: React.FC<IFormikCheckboxProps> = ({
  name,
  onChange,
  ...props
}) => {
  const [field, meta, helpers] = useField<boolean>(name)

  const handleChange = () => {
    helpers.setValue(!field.value)
  }

  return (
    <CheckboxInput
      onChange={handleChange}
      error={meta.error}
      {...props}
      value={field.value}
    />
  )
}

export default FormikCheckboxInput

export { IFormikCheckboxProps }
