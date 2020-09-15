import React from "react"
import { Toaster, ToastProvider, useToaster } from "../Toaster"
import { withKnobs, select, number } from "@storybook/addon-knobs"

export default {
  title: "Toaster",
  component: Toaster,
  decorators: [withKnobs],
}

export const ToasterWrapper: React.FC = () => {
  return (
    <ToastProvider
      autoDismiss
      autoDismissTimeout={number("auto dismiss", 5000)}
      components={{ Toast: Toaster }}
      placement={select(
        "Placement",
        [
          "top-right",
          "bottom-right",
          "top-center",
          "bottom-center",
          "top-left",
          "bottom-left",
        ],
        "top-right",
      )}
    >
      <ToasterDemo />
    </ToastProvider>
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
