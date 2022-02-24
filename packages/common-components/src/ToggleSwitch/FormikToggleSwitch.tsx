import { useField } from "formik"
import React from "react"
import { IToggleSwitch, ToggleSwitch } from "."


interface IFormikToggleSwitch extends IToggleSwitch {
  name: string
}

const FormikToggleSwitch = ({ injectedClasses, disabled, name, left, right, size }: IFormikToggleSwitch) => {
  const [field, meta, helpers] = useField(name)
  const handleChange = (value: any) => {
    helpers.setValue(value)
  }

  return <ToggleSwitch
    {...field}
    left={left}
    right={right}
    size={size}
    disabled={disabled}
    onChange={handleChange}
    injectedClasses={injectedClasses}
    error={meta.error}
  />
}

export default FormikToggleSwitch
