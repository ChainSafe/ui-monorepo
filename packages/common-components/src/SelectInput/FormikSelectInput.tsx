import React, { ReactNode } from "react"
import { useField } from "formik"
import SelectInput from "./SelectInput"
import SelectOption from "./SelectOption"

interface IFormikSelectInputProps {
  className?: string
  name: string
  label?: string
  children: ReactNode | ReactNode[]
}

const FormikSelectInput: React.FC<IFormikSelectInputProps> = ({
  name,
  ...props
}) => {
  const [field, meta, helpers] = useField(name)

  const handleChange = () => {
    helpers.setValue(!field.value)
  }

  return (
    <SelectInput
      onChange={handleChange}
      error={meta.error}
      {...props}
      value={field.value}
    >
      <SelectOption label="a" />
      <SelectOption label="b" />
    </SelectInput>
  )
}

export default FormikSelectInput

export { IFormikSelectInputProps as IFormikCheckboxProps }
