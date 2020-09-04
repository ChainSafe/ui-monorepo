import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import clsx from "clsx"
import { ITheme } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) => {
  const shadowStyles = {}
  theme.shadows.forEach((shadow) => {
    shadowStyles[`shadow-${shadow}`] = {
      boxShadow: shadow,
    }
  })

  return createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      width: "max-content",
      transition: `all ${theme.animation.transform}ms`,
      padding: `${theme.constants.generalUnit}px`,
    },
    fullWidth: {
      width: "inherit",
    },
    rounded: {
      borderRadius: 4,
    },
    bordered: {
      border: `1px solid ${theme.palette["gray"][5]}`,
    },
    ...shadowStyles,
  })
})

export type IPaperShape = "square" | "rounded"

export interface IPaperProps {
  children?: ReactNode | ReactNode[]
  className?: string
  shape?: IPaperShape
  border?: boolean
  fullWidth?: boolean
  shadow?: string
}

const Paper: React.FC<IPaperProps> = ({
  children,
  className,
  shape = "rounded",
  border,
  fullWidth,
  shadow,
  ...rest
}: IPaperProps) => {
  const classes = useStyles()

  return (
    <div
      className={clsx(
        classes.root,
        shape === "rounded" && classes.rounded,
        border && classes.bordered,
        fullWidth && classes.fullWidth,
        shadow && classes[`shadow-${shadow}`],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Paper
