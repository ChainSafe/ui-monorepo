import React from "react"

export interface IRadioInputProps {
  className?: string
  value: string
  name: string
  label: string
}

const RadioInput: React.FC<IRadioInputProps> = ({ value, name, label }) => {
  return (
    <label>
      <input type="radio" id={name} name={name} value={value} />
      <label htmlFor={name}>{label}</label>
    </label>
  )
}

export default RadioInput
