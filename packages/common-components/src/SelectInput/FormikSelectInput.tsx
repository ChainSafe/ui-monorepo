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
  const [, meta, helpers] = useField(name)
  const handleChange = (value: any) => {
    helpers.setValue(value)
  }

  return (
    <SelectInput
      {...field}
      onChange={handleChange}
      error={meta.error}
      options={options}
      {...props}
    />
  )
}

export default FormikSelectInput

export { IFormikSelectInputProps as IFormikCheckboxProps }
