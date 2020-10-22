import React from "react"
import { useField } from "formik"
import SelectInput, { ISelectInputProps, ISelectOption } from "./SelectInput"

interface IFormikSelectInputProps extends ISelectInputProps {
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
  const handleChange = (value: any) => {
    helpers.setValue(value)
  }

  return (
    <SelectInput
      {...field}
      error={meta.error}
      options={options}
      {...props}
      onChange={handleChange}
    />
  )
}

export default FormikSelectInput

export { IFormikSelectInputProps as IFormikCheckboxProps }
