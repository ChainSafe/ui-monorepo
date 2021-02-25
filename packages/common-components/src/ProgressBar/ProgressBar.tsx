import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { ITheme } from "@chainsafe/common-theme"

interface IStyleProps {
  width: number
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    "@keyframes increase": {
      from: {
        left: "-5%",
        width: "5%"
      },
      to: {
        left: "130%",
        width: "100%"
      }
    },
    "@keyframes decrease": {
      from: {
        left: "-80%",
        width: "80%"
      },
      to: {
        left: "110%",
        width: "10%"
      }
    },
    root: {
      backgroundColor: theme.palette.additional["gray"][4],
      position: "relative",
      "&.small": {
        height: theme.constants.generalUnit,
        borderRadius: theme.constants.generalUnit
      },
      "&.medium": {
        height: theme.constants.generalUnit * 2,
        borderRadius: theme.constants.generalUnit * 2
      },
      "&.large": {
        height: theme.constants.generalUnit * 3,
        borderRadius: theme.constants.generalUnit * 3
      }
    },
    line: {
      position: "absolute",
      opacity: 0.4,
      width: "150%",
      background: theme.palette.additional["blue"][6],
      "&.primary": {
        background: theme.palette.primary.main
      },
      "&.secondary": {
        background: theme.palette.secondary.main
      },
      "&.small": {
        height: theme.constants.generalUnit,
        borderRadius: theme.constants.generalUnit
      },
      "&.medium": {
        height: theme.constants.generalUnit * 2,
        borderRadius: theme.constants.generalUnit * 2
      },
      "&.large": {
        height: theme.constants.generalUnit * 3,
        borderRadius: theme.constants.generalUnit * 3
      }
    },
    slider: {
      position: "absolute",
      overflowX: "hidden",
      width: "100%",
      "&.small": {
        height: theme.constants.generalUnit,
        borderRadius: theme.constants.generalUnit
      },
      "&.medium": {
        height: theme.constants.generalUnit * 2,
        borderRadius: theme.constants.generalUnit * 2
      },
      "&.large": {
        height: theme.constants.generalUnit * 3,
        borderRadius: theme.constants.generalUnit * 3
      }
    },
    subline: {
      position: "absolute",
      background: theme.palette.additional["blue"][6],
      "&.primary": {
        background: theme.palette.primary.main
      },
      "&.secondary": {
        background: theme.palette.secondary.main
      },
      "&.small": {
        height: theme.constants.generalUnit,
        borderRadius: theme.constants.generalUnit
      },
      "&.medium": {
        height: theme.constants.generalUnit * 2,
        borderRadius: theme.constants.generalUnit * 2
      },
      "&.large": {
        height: theme.constants.generalUnit * 3,
        borderRadius: theme.constants.generalUnit * 3
      },
      "&.inc": {
        animation: "$increase 2s infinite"
      },
      "&.dec": {
        animation: "$decrease 2s 0.5s infinite"
      }
    },
    progressBar: ({ width }: IStyleProps) => ({
      borderRadius: theme.constants.generalUnit,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      transition: `${theme.animation.translate}ms`,
      width: `${width}%`,
      "&.small": {
        borderRadius: theme.constants.generalUnit
      },
      "&.medium": {
        borderRadius: theme.constants.generalUnit * 2
      },
      "&.large": {
        borderRadius: theme.constants.generalUnit * 3
      }
    }),
    progress: {
      background: theme.palette.additional["blue"][6],
      "&.primary": {
        background: theme.palette.primary.main
      },
      "&.secondary": {
        background: theme.palette.secondary.main
      }
    },
    success: {
      background: theme.palette.success.main
    },
    error: {
      background: theme.palette.error.main
    }
  })
)

export type ProgressBarState = "success" | "error" | "progress"
export type ProgressBarSize = "small" | "medium" | "large"
export type ProgressBarVariant = "primary" | "secondary"

export interface IProgressBarProps {
  className?: string
  state?: ProgressBarState
  progress?: number
  size?: ProgressBarSize
  variant?: ProgressBarVariant
}
const ProgressBar: React.FC<IProgressBarProps> = ({
  className,
  state = "progress",
  progress = -1,
  size = "medium",
  variant,
  ...rest
}) => {
  const progressValue = progress < -1 ? -1 : progress > 100 ? 100 : progress
  const classes = useStyles({ width: progressValue })

  return (
    <div className={clsx(className, classes.root, size)} {...rest}>
      {progressValue == -1 ? (
        <div className={clsx(classes.slider, size)}>
          <div className={clsx(variant, size, classes.line)}></div>
          <div className={clsx(variant, size, classes.subline, "inc")}></div>
          <div className={clsx(variant, size, classes.subline, "dec")}></div>
        </div>
      ) : (
        <div
          className={clsx(classes.progressBar, size, classes[state], variant)}
        />
      )}
    </div>
  )
}

export default ProgressBar
