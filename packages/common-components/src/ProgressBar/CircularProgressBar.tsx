import React from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"

interface IStyleProps {
  progress: number
  circumference: number
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    backdrop: {
      stroke: theme.palette.additional["gray"][4],
    },
    root: {
      backgroundColor: theme.palette.additional["gray"][4],
      position: "relative",
      "&.small": {
        height: theme.constants.generalUnit,
        borderRadius: theme.constants.generalUnit,
      },
      "&.medium": {
        height: theme.constants.generalUnit * 2,
        borderRadius: theme.constants.generalUnit * 2,
      },
      "&.large": {
        height: theme.constants.generalUnit * 3,
        borderRadius: theme.constants.generalUnit * 3,
      },
    },
    progressBar: (props: IStyleProps) => ({
      strokeLinecap: "round",
      strokeDasharray: `${props.circumference}px ${props.circumference}px`,
      strokeDashoffset: `${
        ((100 - props.progress) / 100) * props.circumference
      }px`,
      transition: `${theme.animation.transform}ms`,
    }),
    progress: {
      stroke: theme.palette.additional["blue"][6],
      "&.primary": {
        stroke: theme.palette.primary.main,
      },
      "&.secondary": {
        stroke: theme.palette.secondary.main,
      },
    },
    success: {
      stroke: theme.palette.success.main,
    },
    error: {
      stroke: theme.palette.error.main,
    },
  }),
)

export type ProgressBarState = "success" | "error" | "progress"
export type ProgressBarSize = "small" | "medium" | "large"
export type ProgressBarVariant = "primary" | "secondary"

export interface ICircularProgressBarProps {
  className?: string
  progress: number
  size?: ProgressBarSize
  variant?: ProgressBarVariant
  state?: ProgressBarState
  showBackdrop?: boolean
  width: number
}

const CircularProgressBar: React.FC<ICircularProgressBarProps> = ({
  progress,
  size = "medium",
  state = "progress",
  variant,
  showBackdrop = true,
  width,
  className,
}) => {
  const strokeWidth = size === "small" ? 2 : size === "medium" ? 3 : 4
  const radius = width
  const finalRadius = radius - strokeWidth
  const finalWidth = finalRadius + strokeWidth
  const pathDescription = `
  M ${finalWidth},${finalWidth} m 0,-${finalRadius}
  a ${finalRadius},${finalRadius} 0 1 1 0,${2 * finalRadius}
  a ${finalRadius},${finalRadius} 0 1 1 0,-${2 * finalRadius}
  `
  const diameter = 2 * radius
  const circumference = Math.PI * 2 * radius

  const progressValue = progress < 0 ? 0 : progress > 100 ? 100 : progress

  const classes = useStyles({
    progress: progressValue,
    circumference,
  })

  return (
    <svg
      className={className}
      viewBox={`0 0 ${diameter} ${diameter}`}
      width={diameter}
      height={diameter}
    >
      {showBackdrop && (
        <path
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          className={classes.backdrop}
        />
      )}

      <path
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        className={clsx(classes.progressBar, size, classes[state], variant)}
      />
    </svg>
  )
}

export default CircularProgressBar
