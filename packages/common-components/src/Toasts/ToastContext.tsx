import React, { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { AddToast, Toast, ToastPosition } from "./types"
import { v4 as uuidv4 } from "uuid"
import { ToastContent } from "./ToastContent"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, zIndex, breakpoints, animation }: ITheme) => {
  const WIDTH = 400
  return createStyles({
    toastWrapper: {
      margin: constants.generalUnit,
      zIndex: zIndex?.layer1,
      width: WIDTH,
      "&.top-left": {
        position: "fixed",
        top: 0,
        left: 0,
        animation: `$slideRight ${animation.translate}ms`,
        [breakpoints.down("sm")]: {
          animation: `$slideDown ${animation.translate}ms`,
          margin: constants.generalUnit,
          width: `calc(100% - ${constants.generalUnit * 2}px)`
        },
      },
      "&.top-right": {
        position: "fixed",
        top: 0,
        right: 0,
        animation: `$slideLeft ${animation.translate}ms`,
        [breakpoints.down("sm")]: {
          animation: `$slideDown ${animation.translate}ms`,
          margin: constants.generalUnit,
          width: `calc(100% - ${constants.generalUnit * 2}px)`
        },
      },
      "&.bottom-left": {
        position: "fixed",
        bottom: 0,
        left: 0,
        animation: `$slideRight ${animation.translate}ms`,
        [breakpoints.down("sm")]: {
          animation: `$slideUp ${animation.translate}ms`,
          margin: constants.generalUnit,
          width: `calc(100% - ${constants.generalUnit * 2}px)`
        },
      },
      "&.bottom-right": {
        position: "fixed",
        bottom: 0,
        right: 0,
        animation: `$slideLeft ${animation.translate}ms`,
        [breakpoints.down("sm")]: {
          animation: `$slideUp ${animation.translate}ms`,
          margin: constants.generalUnit,
          width: `calc(100% - ${constants.generalUnit * 2}px)`
        },
      }
    },
    "@keyframes slideRight": {
      from: { transform: "translate(-100%)" },
      to: { transform: "translate(0)" }
    },
    "@keyframes slideLeft": {
      from: { transform: "translate(100%)" },
      to: { transform: "translate(0)" }
    },
    "@keyframes slideUp": {
      from: { transform: "translate(0, 100%)" },
      to: { transform: "translate(0, 0)" }
    },
    "@keyframes slideDown": {
      from: { transform: "translate(0, -100%)" },
      to: { transform: "translate(0, 0)" }
    }
  })
})

type ToastContextProps = {
  autoDismiss?: boolean
  dismissTimeout?: number
  defaultPosition?: ToastPosition
  children: React.ReactNode | React.ReactNode[]
}

interface ToastContext {
  addToast(toastData: AddToast): string
  updateToast(toastId: string, toastData: AddToast): void
  removeToast(toastId: string): void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContext | undefined>(
  undefined
)

const ToastProvider = ({
  children,
  autoDismiss = true,
  defaultPosition = "top-right",
  dismissTimeout = 5000
}: ToastContextProps) => {
  const classes = useStyles()
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toastData: AddToast) => {
    const id = uuidv4()
    setToasts([...toasts, { id, ...toastData }])

    const isProgressToast = toastData.progress !== undefined && toastData.progress < 100;
    const shouldDismiss = toastData.autoDismiss && autoDismiss
    const dismissTimeOut = toastData.dismissTimeout || dismissTimeout

    if (shouldDismiss && !isProgressToast) {
      setTimeout(() => {
        removeToast(id)
      }, dismissTimeOut)
    }

    return id
  }

  const removeToast = (toastId: string) => {
    setToasts(toasts.filter((toast) => toast.id !== toastId))
  }

  const updateToast = (toastId: string, toastData: AddToast, startDismissal?: boolean) => {
    const dismissTimeOut = toastData.dismissTimeout || dismissTimeout
    if (startDismissal) {
      setTimeout(() => {
        removeToast(toastId)
      }, dismissTimeOut)
    }
    setToasts(toasts.map((toast) => toast.id === toastId ? {id: toastId, ...toastData} : toast))
  } 

  return (
    <ToastContext.Provider
      value={{
        addToast,
        updateToast,
        removeToast,
        toasts
      }}
    >
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={clsx(classes.toastWrapper, toast.toastPosition || defaultPosition)}
          >
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
