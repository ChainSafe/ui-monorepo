import React from "react"
import { Toaster, ToasterProvider, useToaster } from "../Toaster"
import { withKnobs, number } from "@storybook/addon-knobs"

export default {
  title: "Toaster",
  component: Toaster,
  decorators: [withKnobs],
}

export const ToasterWrapper: React.FC = () => {
  return (
    <ToasterProvider
      autoDismiss
      autoDismissTimeout={number("auto dismiss", 5000)}
    >
      <ToasterDemo />
    </ToasterProvider>
  )
}

const ToasterDemo: React.FC = () => {
  const { addToastMessage } = useToaster()

  const onAddToast = () => {
    addToastMessage({
      message: "Update successful",
      description: "Your updates are complete",
    })
  }

  return <button onClick={onAddToast}>open toaster</button>
}
