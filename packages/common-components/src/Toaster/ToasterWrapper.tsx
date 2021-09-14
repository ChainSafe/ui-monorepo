import React, { useCallback } from "react"
import ToasterContent from "./ToasterContent"
import { useToasts, AppearanceTypes, Placement } from "react-toast-notifications"

export interface IToasterMessage {
  message: string
  description?: string
  appearance?: AppearanceTypes
  autoDismiss?: boolean
  onDismiss?: (id: string) => void
}

export const useToaster = () => {
  const { addToast } = useToasts()

  const addToastMessage = useCallback((config: IToasterMessage) => {
    addToast(
      <ToasterContent
        message={config.message}
        description={config.description}
      />,
      {
        appearance: config.appearance || "success",
        autoDismiss: config.autoDismiss,
        onDismiss: config.onDismiss
      }
    )
  }, [addToast])

  return {
    addToastMessage
  }
}

export { AppearanceTypes, Placement }
