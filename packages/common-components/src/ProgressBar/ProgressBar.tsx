import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { ITheme } from "@chainsafe/common-theme"

interface IStyleProps {
  width: number
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
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
      borderRadius: theme.constants.generalUnit,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      transition: `${theme.animation.translate}ms`,
      width: `${props.width}%`,
      "&.small": {
        borderRadius: theme.constants.generalUnit,
      },
      "&.medium": {
        borderRadius: theme.constants.generalUnit * 2,
      },
      "&.large": {
        borderRadius: theme.constants.generalUnit * 3,
      },
    }),
    progress: {
      background: theme.palette.additional["blue"][6],
      "&.primary": {
        background: theme.palette.primary.main,
      },
      "&.secondary": {
        background: theme.palette.secondary.main,
      },
    },
    success: {
      background: theme.palette.success.main,
    },
    error: {
      background: theme.palette.error.main,
    },
  }),
)

export type ProgressBarState = "success" | "error" | "progress"
export type ProgressBarSize = "small" | "medium" | "large"
export type ProgressBarVariant = "primary" | "secondary"

export interface IProgressBarProps {
  className?: string
  state?: ProgressBarState
  progress: number
  size?: ProgressBarSize
  variant?: ProgressBarVariant
}
const ProgressBar: React.FC<IProgressBarProps> = ({
  className,
  state = "progress",
  progress,
  size = "medium",
  variant,
  ...rest
}) => {
  const progressValue = progress < 0 ? 0 : progress > 100 ? 100 : progress
  const classes = useStyles({ width: progressValue })

  return (
    <div className={clsx(className, classes.root, size)} {...rest}>
      <div
        className={clsx(classes.progressBar, size, classes[state], variant)}
      />
    </div>
  )
}

export default ProgressBar
