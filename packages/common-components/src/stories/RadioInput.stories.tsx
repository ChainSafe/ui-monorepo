import React, { useState } from "react"
import { boolean, withKnobs } from "@storybook/addon-knobs"
import { RadioInput } from "../RadioInput"

export default {
  title: "RadioInput",
  component: RadioInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs],
}

export const Default = (): React.ReactNode => {
  const [value, setValue] = useState("apple")
  return (
    <>
      <RadioInput
        label="Apple"
        value="apple"
        onChange={(e) => setValue(e.target.value)}
        checked={value === "apple"}
      />
      <RadioInput
        label="Orange"
        value="orange"
        onChange={(e) => setValue(e.target.value)}
        checked={value === "orange"}
      />
      <RadioInput
        label="Grape"
        value="grape"
        onChange={(e) => setValue(e.target.value)}
        disabled={boolean("disabled", false)}
        checked={value === "grape"}
      />
    </>
  )
}
