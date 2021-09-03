import React, { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Toast, ToastPosition } from "./types"
import { v4 as uuidv4 } from "uuid"
import { ToastContent } from "./ToastContent"

const useStyles = makeStyles(({ constants, zIndex, breakpoints, animation }: ITheme) => {
  return createStyles({
    toastWrapper: {
      margin: constants.generalUnit,
      zIndex: zIndex?.layer1,
      "bottom-right": {
        position: "fixed",
        right: 0,
        bottom: 0,
        [breakpoints.down("md")]: {
          margin: constants.generalUnit,
          width: `calc(100% - ${constants.generalUnit * 2}px)`
        },
      }
    },
    appearBox: {
      animation: `$slideLeft ${animation.translate}ms`,
      [breakpoints.down("md")]: {
        animation: `$slideUp ${animation.translate}ms`
      }
    },
    "@keyframes slideLeft": {
      from: { transform: "translate(100%)" },
      to: { transform: "translate(0)" }
    },
    "@keyframes slideUp": {
      from: { transform: "translate(0, 100%)" },
      to: { transform: "translate(0, 0)" }
    }
  })
})

type ToastContextProps = {
  autoDismiss?: boolean
  dismissTime?: number
  defaultPosition?: ToastPosition
  children: React.ReactNode | React.ReactNode[]
}

interface ToastContext {
  addToast(toastData: Omit<Toast, "id">): string
  removeToast(toastId: string): void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContext | undefined>(
  undefined
)

const ToastProvider = ({
  children
  // autoDismiss = true,
  // defaultPosition = "top-right",
  // dismissTime = 5000
}: ToastContextProps) => {
  const classes = useStyles()
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toastData: Omit<Toast, "id">) => {
    const id = uuidv4()
    setToasts([...toasts, { id, ...toastData }])
    return id
  }

  const removeToast = (toastId: string) => {
    setToasts(toasts.filter((toast) => toast.id !== toastId))
  }

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        toasts
      }}
    >
        {toasts.map((toast) => (
          <div key={toast.id} className={classes.toastWrapper}>
            <ToastContent
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      {children}
    </ToastContext.Provider>
  )
}

const useToasts = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToasts must be used within a ToastProvider")
  }
  return context
}

export { ToastProvider, useToasts }
