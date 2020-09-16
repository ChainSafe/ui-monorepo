import React from "react"
import { useField } from "formik"
import SelectInput, { ISelectOption } from "./SelectInput"

interface IFormikSelectInputProps {
  className?: string
  name: string
  options: ISelectOption[]
  label?: string
}

const FormikSelectInput: React.FC<IFormikSelectInputProps> = ({
  name,
  options,
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
      options={options}
      {...props}
      value={field.value}
    />
  )
}

export default FormikSelectInput

export { IFormikSelectInputProps as IFormikCheckboxProps }
