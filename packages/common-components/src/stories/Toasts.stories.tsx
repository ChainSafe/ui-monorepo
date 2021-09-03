import React from "react"
import {
  AddToast,
  ToastContent,
  ToastProvider,
  useToasts
} from "../Toasts"
import { withKnobs, number, select, text, boolean } from "@storybook/addon-knobs"
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
        subtitle: text("subtitle", "Just a subtitle with a lot of info"),
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
        progress: number("progress", 30),
        onProgressCancel: action("on progress cancel")
      }}
      onClose={action("onClose")}
    />
  )
}

export const ToastsContentProgressNoCancel: React.FC = () => {
  return (
    <ToastContent
      toast={{
        id: "2",
        title: text("title", "Upload in progress"),
        type: select("type", ["success", "error"], "success"),
        progress: number("progress", 50)
      }}
      onClose={action("onClose")}
    />
  )
}

export const Toasts: React.FC = () => {
  return (
    <ToastProvider
      autoDismiss={boolean("default auto dismiss", true)}
      dismissTimeout={number("default dismiss timeout", 4000)}
    >
      <ToastNotificationDemo 
        toast={{
          title: text("title", "Upload Started"),
          type: "success",
          toastPosition: select("position", ["top-left", "top-right", "bottom-left", "bottom-right"], "top-right"),
          progress: number("progress", 100),
          autoDismiss: boolean("toast auto dismiss", true),
          dismissTimeout: number("toast dismiss timeout", 4000),
        }}
      />
    </ToastProvider>
  )
}

const ToastNotificationDemo: React.FC<{toast: AddToast}> = ({toast}) => {
  const { addToast, updateToast, toasts } = useToasts()

  const onAddToast = () => {
    addToast(toast)
  }

  return (
    <>
      <button
        onClick={() => onAddToast()}
      >
        open notification
      </button>
      <br />
      {toasts.map((toast) => (
        toast.progress && toast.progress < 80 ? (
          <button onClick={() => updateToast(toast.id, {
            ...toast, 
            progress: toast.progress !== undefined ? toast.progress + 20 : undefined
          })}>
            increase progress toast
          </button>
        ) : null
      ))
      }
    </>
  )
}


