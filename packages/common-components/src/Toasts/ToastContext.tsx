import React, { useCallback, useMemo, useState } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { ToastParams, Toast, ToastPosition } from "./types"
import { v4 as uuidv4 } from "uuid"
import { ToastContent } from "./ToastContent"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, zIndex, breakpoints, animation }: ITheme) => {
  const WIDTH = 400
  return createStyles({
    toastWrapper: {
      position: "fixed",
      width: WIDTH,
      margin: constants.generalUnit,
      zIndex: zIndex?.blocker,
      [breakpoints.down("sm")]: {
        margin: constants.generalUnit,
        width: `calc(100% - ${constants.generalUnit * 2}px)`
      }
    },
    topRightContainer: {
      top: 0,
      right: 0
    },
    topRightAppearBox: {
      animation: `$slideLeft ${animation.translate}ms`,
      [breakpoints.down("sm")]: {
        animation: `$slideDown ${animation.translate}ms`
      }
    },
    topLeftContainer: {
      top: 0,
      left: 0
    },
    topLeftAppearBox: {
      animation: `$slideRight ${animation.translate}ms`,
      [breakpoints.down("sm")]: {
        animation: `$slideDown ${animation.translate}ms`
      }
    },
    bottomRightContainer: {
      bottom: 0,
      right: 0
    },
    bottomRightAppearBox: {
      animation: `$slideLeft ${animation.translate}ms`,
      [breakpoints.down("sm")]: {
        animation: `$slideUp ${animation.translate}ms`
      }
    },
    bottomLeftContainer: {
      bottom: 0,
      left: 0
    },
    bottomLeftAppearBox: {
      animation: `$slideRight ${animation.translate}ms`,
      [breakpoints.down("sm")]: {
        animation: `$slideUp ${animation.translate}ms`
      }
    },
    "@keyframes slideRight": {
      from: { transform: "translate(-100%, 0)" },
      to: { transform: "translate(0, 0)" }
    },
    "@keyframes slideLeft": {
      from: { transform: "translate(100%, 0)" },
      to: { transform: "translate(0, 0)" }
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
  addToast: (toastParams: ToastParams) => string
  updateToast: (toastId: string, toastParams: ToastParams, startDismissal?: boolean) => void
  removeToast: (toastId: string) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContext | undefined>(
  undefined
)

const ToastProvider = ({
  children,
  autoDismiss = true,
  defaultPosition = "topRight",
  dismissTimeout = 5000
}: ToastContextProps) => {
  const classes = useStyles()
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((toastId: string) => {
    setToasts(toasts.filter((toast) => toast.id !== toastId))
  }, [toasts])

  const addToast = useCallback((toastParams: ToastParams) => {
    const id = uuidv4()
    setToasts((toasts) => ([
      ...toasts,
      { id,
        ...toastParams,
        toastPosition: toastParams.toastPosition || defaultPosition
      }
    ]))

    const isProgressToast = toastParams.progress !== undefined
    const shouldDismiss = toastParams.autoDismiss || autoDismiss
    const dismissTimeOut = toastParams.dismissTimeout || dismissTimeout

    if (shouldDismiss && !isProgressToast) {
      setTimeout(() => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
      }, dismissTimeOut)
    }

    return id
  }, [autoDismiss, dismissTimeout, defaultPosition])

  const updateToast = useCallback((toastId: string, toastParams: ToastParams, startDismissal?: boolean) => {
    const dismissTimeOut = toastParams.dismissTimeout || dismissTimeout
    if (startDismissal) {
      setTimeout(() => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId))
      }, dismissTimeOut)
    }
    setToasts((toasts) => toasts.map((toast) => toast.id === toastId ? { ...toast, ...toastParams } : toast))
  }, [dismissTimeout])

  const positionedToasts: Record<ToastPosition, Array<Toast>> = useMemo(() => ({
    topRight: toasts.filter((toast) => toast.toastPosition === "topRight"),
    topLeft: toasts.filter((toast) => toast.toastPosition === "topLeft"),
    bottomRight: toasts.filter((toast) => toast.toastPosition === "bottomRight"),
    bottomLeft: toasts.filter((toast) => toast.toastPosition === "bottomLeft")
  }), [toasts])
  return (
    <ToastContext.Provider
      value={{
        addToast,
        updateToast,
        removeToast,
        toasts
      }}
    >
      {(Object.keys(positionedToasts) as ToastPosition[]).map((position) => (
        !!positionedToasts[position].length && (
          <div
            key={position}
            className={clsx(
              classes.toastWrapper,
              classes[`${position}Container`]
            )}
          >
            {positionedToasts[position].map((toast) => (
              <div
                key={toast.id}
                className={classes[`${position}AppearBox`]}
              >
                <ToastContent
                  toast={toast}
                  onClose={() => removeToast(toast.id)}
                />
              </div>
            ))}
          </div>
        )
      ))
      }
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
