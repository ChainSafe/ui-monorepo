import React, { ReactNode } from "react"
import { useField } from "formik"
import CheckboxInput from "./CheckboxInput"

interface IFormikCheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label" | "onClick"> {
  className?: string
  name: string
  label?: string | ReactNode
  onClick?: (event: React.MouseEvent) => void
}

const FormikCheckboxInput: React.FC<IFormikCheckboxProps> = ({ name, onChange, onClick, ...props }) => {
  const [field, meta, helpers] = useField<boolean>(name)

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    helpers.setValue(!field.value)
    onChange && onChange(event)
  }

  return (
    <CheckboxInput
      onChange={handleChange}
      onClick={onClick}
      error={meta.touched ? meta.error : undefined}
      {...props}
      value={field.value}
    />
  )
}

export default FormikCheckboxInput

export { IFormikCheckboxProps }
