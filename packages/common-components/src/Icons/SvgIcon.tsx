import React, { ReactNode } from "react"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      fontSize: "1.5em",
      transition: `all ${theme.animation.transform}ms`,
    },
    colorPrimary: {
      fill: theme.palette.primary.main,
    },
    colorSecondary: {
      fill: theme.palette.secondary ? theme.palette.secondary.main : "inherit",
    },
    colorError: {
      fill: theme.palette.error.main,
    },
    colorSuccess: {
      fill: theme.palette.success.main,
    },

    sizeInherit: {
      fontSize: "inherit",
    },

    sizeSmall: {
      fontSize: `${theme.constants.generalUnit * 2}px`,
    },
    sizeMedium: {
      fontSize: `${theme.constants.generalUnit * 3}px`,
    },
    sizeLarge: {
      fontSize: `${theme.constants.generalUnit * 4}px`,
    },
  }),
)

export interface SvgIconProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode | ReactNode[]
  className?: string
  color?: colorProp
  fontSize?: fontSizeProp
}

const SvgIcon: React.FC<SvgIconProps> = ({
  children,
  className,
  color = "inherit",
  fontSize = "medium",
  ...rest
}: SvgIconProps) => {
  const classes = useStyles()

  const Component = "span"

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes[`color${capitalize(color)}`]]: color !== "inherit",
          [classes[`size${capitalize(fontSize)}`]]: true,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default SvgIcon
