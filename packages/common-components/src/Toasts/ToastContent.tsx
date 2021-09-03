import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Toast } from "./types"
import clsx from "clsx"
import { CheckCircleIcon, Typography, CloseCircleIcon, CloseCirceSvg, CrossSvg, ProgressBar } from ".."
// import { Button } from "../Button"

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
      zIndex: zIndex?.layer1,
      [breakpoints.down("md")]: {
        margin: constants.generalUnit,
        width: `calc(100% - ${constants.generalUnit * 2}px)`
      }
    },
    boxContainer: {
      width: WIDTH,
      backgroundColor: palette.additional["gray"][3],
      margin: constants.generalUnit,
      border: `1px solid ${palette.additional["gray"][6]}`,
      padding: constants.generalUnit * 2,
      borderRadius: 4,
      position: "relative",
      "&:hover $closeIcon": {
        visibility: "visible",
        opacity: 1
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
    },
    progressBox: {
      display: "flex",
      alignItems: "center",
      marginTop: constants.generalUnit
    },
    titleContainer: {
      display: "flex",
      alignItems: "center"
    },
    subtitle: {
      marginTop: constants.generalUnit
    },
    icon: {
      marginRight: constants.generalUnit
    },
    progressBar: {
      flex: 1
    },
    progressCrossButton: {
      marginLeft: constants.generalUnit,
      cursor: "pointer",
      width: constants.generalUnit * 2,
      height: constants.generalUnit * 2
    },
    closeIcon: {
      position: "absolute",
      right: "-8px",
      top: "-8px",
      fill: palette.additional["gray"][9],
      width: 16,
      height: 16,
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
        width: "8px",
        height: "8px"
      }
    }
  })
})

export interface ToastContentProps {
  toast: Toast
  onClose(): void
}

const ToastContent = ({ toast, onClose }: ToastContentProps) => {
  const classes = useStyles()
  const { type, title, progress, subtitle, onProgressCancel } = toast
  const showInProgress = progress !== undefined && progress !== 100
  return (
    <div className={clsx(classes.boxContainer)}>
      {showInProgress
        ? <div>
          <div>
            <Typography
              variant="body2"
              component="p"
            >
              {title}
            </Typography>
          </div>
          <div className={classes.progressBox}>
            <ProgressBar
              progress={toast.progress}
              size="small"
              className={classes.progressBar}
            />
            {onProgressCancel &&
              <CloseCirceSvg
                className={classes.progressCrossButton}
                onClick={onProgressCancel}
              />
            }
          </div>
        </div>
        : <div>
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
        </div>
      }
      <div
        className={classes.closeIcon}
        onClick={onClose}
      >
        <CrossSvg />
      </div>
    </div>
  )
}

export { ToastContent }