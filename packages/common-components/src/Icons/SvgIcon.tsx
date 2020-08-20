import React, { ReactNode } from "react"
import clsx from "clsx"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import { capitalize } from "../utils/stringUtils"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      fontSize: "1.5em",
      // whats the solution for these instances which are not strongly typed
      // transition: `all ${theme.animation.transform}ms`
      transition: "all 200ms",
    },
    colorPrimary: {
      fill: theme.palette.primary.main,
    },
    // maybe we should have secondary required
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

    // we should use size units from theme
    sizeSmall: {
      fontSize: "16px",
    },
    sizeMedium: {
      fontSize: "24px",
    },
    sizeLarge: {
      fontSize: "32px",
    },
  }),
)

export interface SvgIconProps {
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
