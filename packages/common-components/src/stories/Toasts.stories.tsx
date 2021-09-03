import React from "react"
import {
  ToastContent
} from "../Toasts"
import { withKnobs, number, select, text } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"

export default {
  title: "Toasts",
  component: ToastContent,
  decorators: [withKnobs]
}

export const ToastsContentNotification: React.FC = () => {
  return (
    <ToastContent
      toast={{
        id: "1",
        title: text("title", "Upload in progress"),
        type: select("type", ["success", "error"], "success"),
        subtitle: text("subtitle", "Just a subtitle with a lot of info")
      }}
      onClose={action("onClose")}
    />
  )
}

export const ToastsContentProgress: React.FC = () => {
  return (
    <ToastContent
      toast={{
        id: "2",
        title: text("title", "Upload in progress"),
        type: select("type", ["success", "error"], "success"),
        progress: number("progress", 0),
        onProgressCancel: action("on progress cancel")
      }}
      onClose={action("onClose")}
    />
  )
}

