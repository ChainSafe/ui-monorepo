import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { ToastContentData } from "./types"
import clsx from "clsx"
import { Typography } from "../Typography"
import { CheckCircleIcon, CloseCircleIcon, CloseCirceSvg, CrossSvg } from "../Icons"
import { ProgressBar } from "../ProgressBar"
import { Loading } from "../Spinner"

const useStyles = makeStyles(({ constants, palette, animation, overrides }: ITheme) => {
  return createStyles({
    root: {
      backgroundColor: palette.additional["gray"][3],
      margin: constants.generalUnit,
      border: `1px solid ${palette.additional["gray"][6]}`,
      padding: constants.generalUnit * 2,
      borderRadius: 4,
      position: "relative",
      "&:hover $closeIcon": {
        visibility: "visible",
        opacity: 1
      },
      ...overrides?.Toasts?.root
    },
    progressBox: {
      display: "flex",
      alignItems: "center",
      marginTop: constants.generalUnit,
      ...overrides?.Toasts?.progressBox
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
      ...overrides?.Toasts?.titleContainer
    },
    subtitle: {
      marginTop: constants.generalUnit,
      ...overrides?.Toasts?.subtitle
    },
    icon: {
      marginRight: constants.generalUnit,
      fill: palette.additional["gray"][9],
      ...overrides?.Toasts?.icon
    },
    progressBar: {
      flex: 1,
      ...overrides?.Toasts?.progressBar
    },
    progressCrossButton: {
      marginLeft: constants.generalUnit,
      cursor: "pointer",
      width: constants.generalUnit * 2,
      height: constants.generalUnit * 2,
      fill: palette.additional["gray"][9],
      ...overrides?.Toasts?.progressCrossButton
    },
    closeIcon: {
      position: "absolute",
      right: 0,
      top: 0,
      transform: "translate(50%,-50%)",
      fill: palette.additional["gray"][9],
      width: constants.generalUnit * 2,
      height: constants.generalUnit * 2,
      borderRadius: "50%",
      backgroundColor: palette.additional["gray"][1],
      border: "1px solid",
      borderColor: palette.additional["gray"][9],
      opacity: 0,
      visibility: "hidden",
      transition: `opacity ${animation.transform}ms`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      "& svg": {
        fill: palette.additional["gray"][9],
        width: constants.generalUnit,
        height: constants.generalUnit
      },
      ...overrides?.Toasts?.closeIcon
    }
  })
})

export interface ToastContentProps {
  toast: ToastContentData
  onClose: () => void
}

const ToastContent = ({ toast, onClose }: ToastContentProps) => {
  const classes = useStyles()
  const { type, title, progress, subtitle, isClosable = true, onProgressCancel, onProgressCancelLoading } = toast
  return (
    <div
      className={clsx(classes.root)}
      data-testid={`toast-${toast.testId}`}
    >
      {progress !== undefined
        ? <>
          <Typography
            variant="body2"
            component="p"
          >
            {title}
          </Typography>
          <div className={classes.progressBox}>
            <ProgressBar
              progress={toast.progress}
              size="small"
              className={classes.progressBar}
            />
            {onProgressCancel &&
              onProgressCancelLoading
              ? <Loading size={16}
                className={classes.progressCrossButton} />
              : <CloseCirceSvg
                className={classes.progressCrossButton}
                onClick={onProgressCancel}
              />
            }
          </div>
        </>
        : <>
          <div className={classes.titleContainer}>
            {type === "success"
              ? <CheckCircleIcon className={classes.icon} />
              : <CloseCircleIcon className={classes.icon} />
            }
            <Typography
              variant="body1"
              component="p"
            >
              {title}
            </Typography>
          </div>
          {subtitle &&
            <Typography
              variant="body2"
              component="p"
              className={classes.subtitle}
            >
              {subtitle}
            </Typography>
          }
        </>
      }
      {isClosable &&
        <div
          className={classes.closeIcon}
          onClick={onClose}
        >
          <CrossSvg />
        </div>
      }
    </div>
  )
}

export { ToastContent }