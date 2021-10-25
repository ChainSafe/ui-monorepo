import { action } from "@storybook/addon-actions"
import { boolean, select } from "@storybook/addon-knobs"
import React, { useState } from "react"
import { ToggleSwitch } from ".."
import { SizeOption } from "./types"

export default {
  title: "ToggleSwitch",
  component: ToggleSwitch
}

const sizeOptions: SizeOption[] = ["large", "medium", "small"]

const actionsData = {
  onChange: action("onChange")
}

export const ToggleSwitchDemo = (): React.ReactNode => {
  const [state, setState] = useState(false)
  return (
    <ToggleSwitch
      left={{
        value: false,
        label: "off"
      }}
      right={{
        value: true,
        label: "on"
      }}
      value={state}
      onChange={(value) => {
        setState(value)
        actionsData.onChange(value)
      }}
      disabled={boolean("Disabled", false)}
      size={select("Size", sizeOptions, "medium")}
    />
  )
}
