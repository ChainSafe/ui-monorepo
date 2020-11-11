import React from "react"
import ToasterContent from "./ToasterContent"
import {
  useToasts,
  AppearanceTypes,
  Placement,
} from "react-toast-notifications"

export interface IToasterMessage {
  message: string
  description?: string
  appearance?: AppearanceTypes
  autoDismiss?: boolean
  onDismiss?(id: string): void
}

export const useToaster = () => {
  const { addToast } = useToasts()

  const addToastMessage = (config: IToasterMessage) => {
    addToast(
      <ToasterContent
        message={config.message}
        description={config.description}
      />,
      {
        appearance: config.appearance || "success",
        autoDismiss: config.autoDismiss,
        onDismiss: config.onDismiss,
      },
    )
  }

  return {
    addToastMessage,
  }
}

export { AppearanceTypes, Placement }
