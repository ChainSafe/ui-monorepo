import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
      ...theme.typography.button,
      transitionDuration: `${theme.animation.transform}ms`,
      border: "none",
      outline: "none",
      "&.large": {
        padding: theme.constants.generalUnit * 2,
      },
      "&.medium": {
        padding: `${theme.constants.generalUnit * 1.5}px ${theme.constants
          .generalUnit * 2}px`,
      },
      "&.small": {
        padding: `${theme.constants.generalUnit}px ${theme.constants
          .generalUnit * 2}px`,
      },
      "&.fullsize": {
        width: "100%",
      },
      "& svg": {
        marginLeft: theme.constants.generalUnit,
      },
    },
    primary: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
      "&:hover": {},
      "&.disabled": {},
    },
    secondary: {
      color: theme.palette.secondary?.main,
      backgroundColor: theme.palette.secondary?.light,
      "&:hover": {
        // color: theme.palette.secondary?.main,
        // backgroundColor: theme.palette.secondary?.light,
      },
      "&.disabled": {
        // color: theme.colors.gray.main,
        // backgroundColor: theme.colors.gray.light,
      },
    },
    tertiary: {
      "&:hover": {},
      "&.disabled": {
        "&:hover": {},
      },
    },
  }),
)

type ReactButton = React.HTMLProps<HTMLButtonElement>

interface IButtonProps extends Omit<ReactButton, "size"> {
  className?: string
  children?: ReactNode | ReactNode[]
  fullsize?: boolean
  variant?: "primary" | "secondary" | "tertiary"
  size?: "large" | "medium" | "small"
  type?: "button" | "submit" | "reset"
}

const Button: React.FC<IButtonProps> = ({
  children,
  fullsize,
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
        fullsize ? "fullsize" : "",
        className,
        classes[variant],
        disabled ? "disabled" : "",
        `${size}`,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
