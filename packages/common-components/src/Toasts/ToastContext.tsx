import React, { useCallback, useMemo, useRef, useState } from "react"
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
  removeAllToasts: () => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContext | undefined>(undefined)

const ToastProvider = ({
  children,
  autoDismiss = true,
  defaultPosition = "topRight",
  dismissTimeout = 5000
}: ToastContextProps) => {
  const classes = useStyles()
  const [toastQueue, setToastQueue] = useState<Toast[]>([])
  // using useRef instead of useState to keep a tracker over the exact toast array
  const toasts = useRef<Toast[]>([])

  const removeToast = useCallback((toastId: string) => {
    toasts.current = toasts.current.filter((toast) => toast.id !== toastId)
    setToastQueue(toasts.current)
  }, [toasts])

  const removeAllToasts = useCallback(() => {
    // cancel any pending progress such as upload/downloads etc.. 
    toasts.current.forEach((toast) => {
      toast.onProgressCancel && toast.onProgressCancel()
    })

    toasts.current = []
    setToastQueue(toasts.current)
  }, [toasts])

  const addToast = useCallback((toastParams: ToastParams) => {
    const id = uuidv4()
    toasts.current = [
      ...toasts.current,
      { id,
        ...toastParams,
        toastPosition: toastParams.toastPosition || defaultPosition
      }
    ]
    setToastQueue(toasts.current)

    const isProgressToast = toastParams.progress !== undefined
    const shouldDismiss = toastParams.autoDismiss || autoDismiss
    const dismissTimeOut = toastParams.dismissTimeout || dismissTimeout

    if (shouldDismiss && !isProgressToast) {
      setTimeout(() => {
        removeToast(id)
      }, dismissTimeOut)
    }

    return id
  }, [defaultPosition, autoDismiss, dismissTimeout, removeToast])

  const updateToast = useCallback((toastId: string, toastParams: ToastParams, startDismissal?: boolean) => {
    const dismissTimeOut = toastParams.dismissTimeout || dismissTimeout
    if (startDismissal) {
      setTimeout(() => {
        removeToast(toastId)
      }, dismissTimeOut)
    }
    toasts.current = toasts.current.map((toast) => toast.id === toastId ? { ...toast, ...toastParams } : toast)
    setToastQueue(toasts.current)
  }, [dismissTimeout, removeToast])

  const positionedToasts: Record<ToastPosition, Array<Toast>> = useMemo(() => ({
    topRight: toastQueue.filter((toast) => toast.toastPosition === "topRight"),
    topLeft: toastQueue.filter((toast) => toast.toastPosition === "topLeft"),
    bottomRight: toastQueue.filter((toast) => toast.toastPosition === "bottomRight"),
    bottomLeft: toastQueue.filter((toast) => toast.toastPosition === "bottomLeft")
  }), [toastQueue])

  return (
    <ToastContext.Provider
      value={{
        addToast,
        updateToast,
        removeToast,
        removeAllToasts,
        toasts: toastQueue
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
