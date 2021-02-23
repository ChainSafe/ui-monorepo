import React from "react"
import { useField } from "formik"
import SelectInput, { ISelectInputProps, ISelectOption } from "./SelectInput"

export interface IFormikSelectInputProps
  extends Omit<ISelectInputProps, "onChange"> {
  className?: string;
  name: string;
  options: ISelectOption[];
  label?: string;
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
      onChange={handleChange}
      error={meta.error}
      options={options}
      {...props}
    />
  )
}

export default FormikSelectInput
