import React, { useState } from "react"
import { Toaster, ToasterMessage, ToasterMessageType } from "../Toaster"
import { withKnobs, select } from "@storybook/addon-knobs"

export default {
  title: "Toaster",
  component: Toaster,
  decorators: [withKnobs],
}

const toasterMessageTypes: ToasterMessageType[] = [
  "error",
  "warning",
  "success",
]

export const MainDemo: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)}>open toaster</button>
      <Toaster open={open}>
        <ToasterMessage
          onClose={() => setOpen(false)}
          message="Update successful"
          description="Your request was successfully completed."
          type={select("Type", toasterMessageTypes, "error")}
        />
      </Toaster>
    </>
  )
}
