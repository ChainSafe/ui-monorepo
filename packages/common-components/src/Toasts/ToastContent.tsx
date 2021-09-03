import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { ToastContentData } from "./types"
import clsx from "clsx"
import { Typography } from "../Typography"
import { CheckCircleIcon, CloseCircleIcon, CloseCirceSvg, CrossSvg } from "../Icons"
import { ProgressBar } from "../ProgressBar"

const useStyles = makeStyles(({ constants, palette, animation }: ITheme) => {
  return createStyles({
    boxContainer: {
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
  toast: ToastContentData
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