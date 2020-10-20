import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles(
  ({ constants, typography, animation, palette, overrides }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        ...typography.button,
        borderRadius: `${constants.generalUnit / 4}px`,
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        textDecoration: "none",
        cursor: "pointer",
        transitionDuration: `${animation.transform}ms`,
        border: "none",
        outline: "none",
        "& svg": {
          transitionDuration: `${animation.transform}ms`,
          margin: `${0}px ${constants.generalUnit / 2}px 0`,
        },
        "&.large": {
          padding: `${constants.generalUnit}px ${constants.generalUnit * 2}px`,
          ...overrides?.Button?.size?.large,
        },
        "&.medium": {
          padding: `${constants.generalUnit * 0.6}px ${
            constants.generalUnit * 2
          }px`,
          ...overrides?.Button?.size?.medium,
        },
        "&.small": {
          padding: `${constants.generalUnit * 0.125}px ${
            constants.generalUnit
          }px`,
          ...overrides?.Button?.size?.small,
        },
        ...overrides?.Button?.root,
      },
      // Variants
      primary: {
        backgroundColor: palette.primary.main,
        color: palette.common.white.main,
        "& svg": {
          fill: palette.common.white.main,
        },
        "&:hover": {
          backgroundColor: palette.primary.hover
            ? palette.primary.hover
            : palette.primary.main,
          ...overrides?.Button?.variants?.primary?.hover,
        },
        "&:focus": {
          backgroundColor: palette.primary.hover
            ? palette.primary.hover
            : palette.primary.main,
          ...overrides?.Button?.variants?.primary?.focus,
        },
        "&:active": {
          backgroundColor: palette.primary.hover
            ? palette.primary.hover
            : palette.primary.main,
          ...overrides?.Button?.variants?.primary?.active,
        },
        ...overrides?.Button?.variants?.primary?.root,
      },
      outline: {
        color: palette.additional["gray"][8],
        backgroundColor: palette.common?.white.main,
        border: `1px solid ${palette.additional["gray"][5]}`,
        "& svg": {
          fill: palette.additional["gray"][8],
        },
        "&:hover": {
          borderColor: palette.additional["blue"][5],
          color: palette.additional["blue"][5],
          "& svg": {
            fill: palette.additional["blue"][5],
          },
          ...overrides?.Button?.variants?.outline?.hover,
        },
        "&:focus": {
          borderColor: palette.additional["blue"][5],
          color: palette.additional["blue"][5],
          "& svg": {
            fill: palette.additional["blue"][5],
          },
          ...overrides?.Button?.variants?.outline?.focus,
        },
        "&:active": {
          borderColor: palette.additional["blue"][7],
          color: palette.additional["blue"][7],
          "& svg": {
            fill: palette.additional["blue"][7],
          },
          ...overrides?.Button?.variants?.outline?.active,
        },
        ...overrides?.Button?.variants?.outline?.root,
      },
      dashed: {
        color: palette.additional["gray"][8],
        backgroundColor: palette.common?.white.main,
        border: `1px dashed ${palette.additional["gray"][5]}`,
        "& svg": {
          fill: palette.additional["gray"][8],
        },
        "&:hover": {
          borderColor: palette.additional["blue"][5],
          color: palette.additional["blue"][5],
          "& svg": {
            fill: palette.additional["blue"][5],
          },
          ...overrides?.Button?.variants?.dashed?.hover,
        },
        "&:focus": {
          borderColor: palette.additional["blue"][5],
          color: palette.additional["blue"][5],
          "& svg": {
            fill: palette.additional["blue"][5],
          },
          ...overrides?.Button?.variants?.dashed?.focus,
        },
        "&:active": {
          borderColor: palette.additional["blue"][7],
          color: palette.additional["blue"][7],
          "& svg": {
            fill: palette.additional["blue"][7],
          },
          ...overrides?.Button?.variants?.dashed?.active,
        },
        ...overrides?.Button?.variants?.dashed?.root,
      },
      danger: {
        color: palette.common?.white.main,
        backgroundColor: palette.additional["red"][5],
        border: `1px solid transparent`,
        "& svg": {
          fill: palette.common?.white.main,
        },
        "&:hover": {
          backgroundColor: palette.additional["red"][4],
          ...overrides?.Button?.state?.danger?.hover,
        },
        "&:focus": {
          backgroundColor: palette.additional["red"][4],
          ...overrides?.Button?.state?.danger?.focus,
        },
        "&:active": {
          backgroundColor: palette.additional["red"][7],
          ...overrides?.Button?.state?.danger?.active,
        },
        ...overrides?.Button?.state?.danger?.root,
      },
      // Modifiers
      fullsize: {
        width: "100%",
      },
      icon: {
        borderRadius: "50%",
        padding: 0,
        position: "relative",
        "& > *": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        "& svg": {
          margin: 0,
        },
        "&.large": {
          height: constants.generalUnit * 5,
          width: constants.generalUnit * 5,
          "& svg": {
            height: 20,
            width: 20,
          },
          ...overrides?.Button?.icon?.large,
        },
        "&.medium": {
          height: constants.generalUnit * 4,
          width: constants.generalUnit * 4,
          "& svg": {
            height: 18,
            width: 18,
          },
          ...overrides?.Button?.icon?.medium,
        },
        "&.small": {
          height: constants.generalUnit * 3,
          width: constants.generalUnit * 3,
          "& svg": {
            height: 16,
            width: 16,
          },
          ...overrides?.Button?.icon?.small,
        },
        ...overrides?.Button?.icon?.root,
      },
      disabled: {
        backgroundColor: `${palette.additional["gray"][3]} !important`,
        borderColor: `${palette.additional["gray"][5]} !important`,
        color: `${palette.additional["gray"][6]} !important`,
        cursor: "initial",
        "& svg": {
          fill: `${palette.additional["gray"][6]} !important`,
        },
        "&:hover": {
          backgroundColor: palette.additional["gray"][3],
          borderColor: palette.additional["gray"][5],
          color: palette.additional["gray"][6],
          "& svg": {
            fill: `${palette.additional["gray"][6]} !important`,
          },
          ...overrides?.Button?.state?.disabled?.hover,
        },
        ...overrides?.Button?.state?.disabled?.root,
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

export { IButtonProps }
