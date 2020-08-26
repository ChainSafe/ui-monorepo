import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      ...theme.typography.button,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
      transitionDuration: `${theme.animation.transform}ms`,
      border: "none",
      outline: "none",
      "& svg": {
        margin: `${theme.constants.generalUnit / 4}px ${theme.constants
          .generalUnit / 2}px`,
      },
    },
    // Sizes
    large: {
      padding: `${theme.constants.generalUnit}px ${theme.constants.generalUnit *
        2}px`,
    },
    medium: {
      padding: `${theme.constants.generalUnit * 0.6}px ${theme.constants
        .generalUnit * 2}px`,
    },
    small: {
      padding: `${theme.constants.generalUnit * 0.125}px ${
        theme.constants.generalUnit
      }px`,
    },
    // Variants
    primary: {
      backgroundColor: theme.palette["blue"][6],
      color: theme.palette.common?.white.main,
      "&:hover": {
        backgroundColor: theme.palette["blue"][5],
      },
      "&:focus": {
        backgroundColor: theme.palette["blue"][5],
      },
      "&:active": {
        backgroundColor: theme.palette["blue"][7],
      },
    },
    outline: {
      color: theme.palette["gray"][8],
      backgroundColor: theme.palette.common?.white.main,
      border: `1px solid ${theme.palette["gray"][5]}`,
      "&:hover": {
        borderColor: theme.palette["blue"][5],
        color: theme.palette["blue"][5],
      },
      "&:focus": {
        borderColor: theme.palette["blue"][5],
        color: theme.palette["blue"][5],
      },
      "&:active": {
        borderColor: theme.palette["blue"][7],
        color: theme.palette["blue"][7],
      },
    },
    dashed: {
      color: theme.palette["gray"][8],
      backgroundColor: theme.palette.common?.white.main,
      border: `1px dashed ${theme.palette["gray"][5]}`,
      "&:hover": {
        borderColor: theme.palette["blue"][5],
        color: theme.palette["blue"][5],
      },
      "&:focus": {
        borderColor: theme.palette["blue"][5],
        color: theme.palette["blue"][5],
      },
      "&:active": {
        borderColor: theme.palette["blue"][7],
        color: theme.palette["blue"][7],
      },
    },
    danger: {
      color: theme.palette.common?.white.main,
      backgroundColor: theme.palette["red"][5],
      "&:hover": {
        backgroundColor: theme.palette["red"][4],
      },
      "&:focus": {
        backgroundColor: theme.palette["red"][4],
      },
      "&:active": {
        backgroundColor: theme.palette["red"][7],
      },
    },
    // Modifiers
    fullsize: {
      width: "100%",
    },
    icon: {
      borderRadius: "50%",
    },
    disabled: {
      backgroundColor: theme.palette["gray"][3],
      borderColor: theme.palette["gray"][5],
      color: theme.palette["gray"][6],
    },
  }),
)

type ReactButton = React.HTMLProps<HTMLButtonElement>

interface IButtonProps extends Omit<ReactButton, "size"> {
  className?: string
  children?: ReactNode | ReactNode[]
  fullsize?: boolean
  variant?: "primary" | "outline" | "dashed" | "danger"
  iconButton?: boolean
  size?: "large" | "medium" | "small"
  type?: "button" | "submit" | "reset"
}

const Button: React.FC<IButtonProps> = ({
  children,
  fullsize,
  iconButton,
  className,
  variant = "primary",
  disabled = false,
  size = "medium",
  ...rest
}: IButtonProps) => {
  const classes = useStyles()
  return (
    <button
      className={clsx(
        classes.root,
        className,
        classes[variant],
        fullsize && classes.fullsize,
        disabled && classes.disabled,
        iconButton && classes.icon,
        classes[size],
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button

export { IButtonProps }
