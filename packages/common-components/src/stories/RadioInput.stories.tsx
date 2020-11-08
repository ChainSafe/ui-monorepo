import React from "react"
import { withKnobs } from "@storybook/addon-knobs"
import { RadioInput, RadioGroup, RadioButton } from "../RadioInput"

export default {
  title: "RadioInput",
  component: RadioInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const Default = (): React.ReactNode => {
  return (
    <>
      <RadioInput name="apple" label="apple" value="apple" />
      <RadioInput name="orange" label="orange" value="orange" />
      <RadioInput name="grape" label="grape" value="grape" />
    </>
  )
}

export const GroupRadio = (): React.ReactNode => {
  return (
    <RadioGroup name="row" value="front">
      <RadioButton label="Front" value="front" />
      <RadioButton label="Middle" value="middle" />
      <RadioButton label="Back" value="back" />
    </RadioGroup>
  )
}

export const SingleRadio = (): React.ReactNode => {
  return <RadioButton label="Front" value="front" />
}
