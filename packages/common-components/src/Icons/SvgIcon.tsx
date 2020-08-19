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
    },
    colorPrimary: {
      color: theme.palette.primary.main,
    },

    // maybe we should have secondary required
    colorSecondary: {
      color: theme.palette.secondary ? theme.palette.secondary.main : "inherit",
    },
    colorError: {
      color: theme.palette.error.main,
    },
    colorSuccess: {
      color: theme.palette.success.main,
    },

    sizeInherit: {
      fontSize: "inherit",
    },

    // we should use size units from theme
    sizeSmall: {
      fontSize: "1em",
    },
    sizeMedium: {
      fontSize: "1.5em",
    },
    sizeLarge: {
      fontSize: "2em",
    },
  }),
)

interface OwnProps {
  children?: ReactNode | ReactNode[]
  className?: string
  color?: "inherit" | "primary" | "secondary" | "disabled" | "error"
  fontSize?: "inherit" | "small" | "medium" | "large"
  htmlColor?: string
  viewBox?: string
}

const SvgIcon: React.FC<OwnProps> = ({
  children,
  className,
  color = "inherit",
  fontSize = "medium",
  htmlColor,
  viewBox = "0 0 24 24",
  ...rest
}: OwnProps) => {
  const classes = useStyles()

  return (
    <svg
      className={clsx(
        classes.root,
        {
          [classes[`color${capitalize(color)}`]]: color !== "inherit",
          [classes[`size${capitalize(fontSize)}`]]: true,
        },
        className,
      )}
      focusable="false"
      viewBox={viewBox}
      color={htmlColor}
      {...rest}
    >
      {children}
    </svg>
  )
}

export default SvgIcon
