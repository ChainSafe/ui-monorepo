import React from "react"
import {
  Toaster,
  ToasterProvider,
  useToaster,
  AppearanceTypes
} from "../Toaster"
import { withKnobs, number, select } from "@storybook/addon-knobs"

export default {
  title: "Toaster",
  component: Toaster,
  decorators: [withKnobs]
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

  const onAddToast = (appearance: AppearanceTypes) => {
    addToastMessage({
      appearance,
      message: "Update successful",
      description: "Your updates are complete"
    })
  }

  return (
    <>
      <button
        onClick={() =>
          onAddToast(
            select("appearance", ["success", "error", "warning"], "success")
          )
        }
      >
        open toaster
      </button>
    </>
  )
}
