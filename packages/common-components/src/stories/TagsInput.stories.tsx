import React, { useState } from "react"
import { boolean, text, withKnobs } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"
import { TagsInput } from "../TagsInput"


export default {
  title: "Tags Input",
  component: TagsInput,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

export const actionsData = {
  onChange: action("onChange")
}

export const TagsInputStory = (): React.ReactNode => {
  const [value, setValue] = useState([])

  const handleFetchTags = async (inputVal: string): Promise<Array<any>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([{ label: inputVal, value: { guid: "abc-def", pubKey: "0xabc345" } }])
      }, 1500)
    })
  }

  return (
    <TagsInput
      onChange={(value: any) => {
        actionsData.onChange(value)
        setValue(value)
      }}
      value={value}
      fetchTags={handleFetchTags}
      disabled={boolean("Disabled", false)}
      label={text("Label", "Testing Label")}
      caption={text("Caption", "Testing caption")}
    />
  )
}