import React from "react"

export interface IRadioInputProps {
  className?: string
  value: string
  name: string
  label: string
}

const RadioInput: React.FC<IRadioInputProps> = ({ value, name, label }) => {
  return (
    <>
      <input type="radio" id={name} name={name} value={value} />
      <label htmlFor={name}>{label}</label>
    </>
  )
}

export default RadioInput
