import React, { ReactNode, useCallback, useState, createContext } from "react"
import Toaster, { ToasterPosition } from "./Toaster"
import ToasterMessage, { ToasterMessageType } from "./ToasterMessage"

export interface IToasterConfig {
  position?: ToasterPosition
  type: ToasterMessageType
  message: string
  description?: string
  openDuration?: number
  keepOpen?: boolean
}

export interface IToasterContext {
  showToast(config: IToasterConfig): void
}

export interface IToasterProvider {
  children: ReactNode | ReactNode[]
  position?: ToasterPosition
  openDuration?: number
}

export const ToasterContext = createContext<IToasterContext | undefined>(
  undefined,
)

export function ToasterProvider({
  children,
  position,
  openDuration,
}: IToasterProvider) {
  const [open, setOpen] = useState(false)
  const [toasts, setToasts] = useState<IToasterConfig[]>([])

  const showToast = useCallback(
    function (toasterConfigInput: IToasterConfig) {
      setToasts([
        ...toasts,
        {
          position: position || "topRight",
          openDuration: openDuration,
          ...toasterConfigInput,
        },
      ])
      setOpen(true)
    },
    [setToasts],
  )

  return (
    <ToasterContext.Provider value={{ showToast: showToast }}>
      {children}
      {toasts.map((toast, index) => (
        <Toaster
          key={index}
          onClose={() => setOpen(false)}
          open={open}
          keepOpen={toast.keepOpen}
          openDuration={toast.openDuration}
          position={toast.position}
        >
          <ToasterMessage
            onClose={() => setOpen(false)}
            message={toast.message}
            description={toast.description}
            type={toast.type}
          />
        </Toaster>
      ))}
    </ToasterContext.Provider>
  )
}

export const useToaster = () => {
  const context = React.useContext(ToasterContext)
  if (context === undefined) {
    throw new Error("useToaster must be used within a ToastProvider")
  }
  return context
}
