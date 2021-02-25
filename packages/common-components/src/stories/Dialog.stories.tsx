import React, { Fragment, useState } from "react"
import { withKnobs, select, text } from "@storybook/addon-knobs"
import { Button } from "../Button"
import { Dialog } from "../Dialog"

export default {
  title: "Dialog",
  component: Button,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

type MaxWidthOption = "xs" | "sm" | "md" | "lg" | "xl" | 400 | undefined
const maxWidthOptions: MaxWidthOption[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  400,
  undefined
]

export const DialogStory = (): React.ReactNode => {
  const [active, setActive] = useState(false)
  return (
    <Fragment>
      <Button onClick={() => setActive(true)} variant="primary" size="large">
        Open dialog
      </Button>
      <Dialog
        active={active}
        maxWidth={select("Max width position", maxWidthOptions, 400)}
        accept={() => setActive(false)}
        reject={() => setActive(false)}
        acceptText={text("Accept text", "Confirm")}
        rejectText={text("Reject text", "Cancel")}
        requestMessage={text("Request message", "Please confirm")}
      />
    </Fragment>
  )
}
