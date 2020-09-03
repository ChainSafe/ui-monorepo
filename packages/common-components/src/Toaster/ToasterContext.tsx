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
}

export const ToasterContext = createContext<IToasterContext | undefined>(
  undefined,
)

export function ToasterProvider({ children }: IToasterProvider) {
  const [open, setOpen] = useState(false)
  const [toasterConfig, setToasterConfig] = useState<IToasterConfig>({
    position: "topRight",
    message: "",
    type: "success",
  })

  const showToast = useCallback(
    function (toasterConfigInput: IToasterConfig) {
      setToasterConfig({
        ...toasterConfig,
        ...toasterConfigInput,
      })
      setOpen(true)
    },
    [toasterConfig],
  )

  return (
    <ToasterContext.Provider value={{ showToast: showToast }}>
      {children}
      <Toaster
        onClose={() => setOpen(false)}
        open={open}
        keepOpen={toasterConfig.keepOpen}
        openDuration={toasterConfig.openDuration}
        position={toasterConfig.position}
      >
        <ToasterMessage
          onClose={() => setOpen(false)}
          message={toasterConfig.message}
          description={toasterConfig.description}
          type={toasterConfig.type}
        />
      </Toaster>
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
