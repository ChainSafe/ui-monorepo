import React, { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { CheckCircleIcon, Typography, CloseCircleIcon, ProgressBar } from ".."
import { Toast } from "./types"
// import { v4 as uuidv4 } from "uuid"

const useStyles = makeStyles(({ constants, zIndex, breakpoints, palette, animation }: ITheme) => {
  const WIDTH = 400
  return createStyles({
    root: {
      margin: constants.generalUnit * 3,
      position: "fixed",
      right: 0,
      bottom: 0,
      borderRadius: 4,
      padding: constants.generalUnit,
      width: WIDTH,
      zIndex: zIndex?.layer1,
      [breakpoints.down("md")]: {
        margin: constants.generalUnit,
        width: `calc(100% - ${constants.generalUnit * 2}px)`
      }
    },
    boxContainer: {
      backgroundColor: palette.additional["gray"][3],
      margin: `${constants.generalUnit}px 0`,
      border: `1px solid ${palette.additional["gray"][6]}`,
      padding: constants.generalUnit * 2,
      borderRadius: 4
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
    },
    contentContainer: {
      display: "flex",
      alignItems: "center"
    },
    marginBottom: {
      marginBottom: constants.generalUnit
    },
    icon: {
      marginRight: constants.generalUnit * 2
    }
  })
})

type ToastContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

interface ToastContext {
  addToast(): void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContext | undefined>(
  undefined
)

const ToastProvider = ({ children }: ToastContextProps) => {
  const classes = useStyles()
  const [toasts] = useState<Toast[]>([])

  const addToast = () => {
    // setToasts([...toasts, { id: "1" }])
  }

  return (
    <ToastContext.Provider
      value={{
        addToast,
        toasts
      }}
    >
      <div className={classes.root}>
        {toasts.map((toast: any) => (
          <>
            <div className={clsx(classes.appearBox, classes.boxContainer)}>
              {!!toast.complete && !toast.error && (
                <div className={classes.contentContainer}>
                  <CheckCircleIcon className={classes.icon} />
                  <Typography
                    variant="body1"
                    component="p"
                  >
                    Download complete
                  </Typography>
                </div>
              )}
              {toast.error && (
                <div className={classes.contentContainer}>
                  <CloseCircleIcon className={classes.icon} />
                  <Typography
                    variant="body1"
                    component="p"
                  >
                    {toast.errorMessage}
                  </Typography>
                </div>
              )}
              {!toast.complete && !toast.error && (
                <div>
                  <Typography
                    variant="body2"
                    component="p"
                    className={classes.marginBottom}
                  >
                    Downloading {toast.fileName} - {toast.fileName}
                  </Typography>
                  <ProgressBar
                    progress={toast.progress}
                    size="small"
                  />
                </div>
              )}
            </div>
          </>
        ))}
      </div>
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
