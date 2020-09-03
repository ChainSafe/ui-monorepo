import React, { useState } from "react"
import {
  Toaster,
  ToasterMessage,
  ToasterMessageType,
  ToasterPosition,
  useToaster,
  ToasterProvider,
} from "../Toaster"
import { withKnobs, select, boolean } from "@storybook/addon-knobs"

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

const toasterPositions: ToasterPosition[] = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
]

export const MainDemo: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)}>open toaster</button>
      <Toaster
        onClose={() => setOpen(false)}
        open={open}
        keepOpen={boolean("keep open", false)}
        openDuration={select("open duration", [3000, 5000, 6000], 1000)}
        position={select("Position", toasterPositions, "topLeft")}
      >
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

export const ToasterWrapper: React.FC = () => {
  return (
    <ToasterProvider>
      <ToasterDemo />
    </ToasterProvider>
  )
}

const ToasterDemo: React.FC = () => {
  const { showToast } = useToaster()

  const onShowToast = () => {
    showToast({
      message: "Update successful",
      type: "success",
      openDuration: 6000,
    })
  }

  return (
    <ToasterProvider>
      <button onClick={onShowToast}>open toaster</button>
    </ToasterProvider>
  )
}
