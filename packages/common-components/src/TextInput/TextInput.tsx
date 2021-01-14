import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Typography } from "../Typography"
import {
  CheckCircleIcon,
  CloseCircleIcon,
  ExclamationCircleIcon,
  SvgIcon,
} from "../Icons"

const iconSize = {
  large: {
    height: 18,
    padding: 6,
  },
  medium: {
    height: 16,
    padding: 6,
  },
  small: {
    height: 16,
    padding: 4,
  },
}

const useStyles = makeStyles(
  ({ typography, constants, palette, animation, zIndex, overrides }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        display: "inline-block",
        ...typography.body2,
        margin: 5,
        cursor: "pointer",
        position: "relative",
        "&.large": {
          fontSize: 14,
          lineHeight: "22px",
          ...overrides?.TextInput?.size?.large,
        },
        "&.medium": {
          fontSize: 14,
          lineHeight: "22px",
          ...overrides?.TextInput?.size?.medium,
        },
        "&.small": {
          fontSize: 14,
          lineHeight: "22px",
          ...overrides?.TextInput?.size?.small,
        },
        "& .right > *:nth-child(2) svg": {
          fill: palette.primary.main,
        },
        "& input": {
          transitionDuration: `${animation.transform}ms`,
          display: "block",
          color: palette.additional["gray"][8],
          borderRadius: 2,
          "&:hover": {
            borderColor: palette.primary.border,
            ...overrides?.TextInput?.input?.hover,
          },
          "&:focus": {
            borderColor: palette.primary.border,
            // borderColor: palette
            boxShadow: "0px 0px 4px rgba(24, 144, 255, 0.5)",
            ...overrides?.TextInput?.input?.focus,
          },
          ...overrides?.TextInput?.input?.root,
        },
        "&.disabled": {
          "& input": {
            color: palette.additional["gray"][6],
            backgroundColor: palette.additional["gray"][3],
            ...overrides?.TextInput?.input?.disabled,
          },
          ...overrides?.TextInput?.disabled,
        },
        ...overrides?.TextInput?.root,
      },
      error: {
        "& .right > *:nth-child(2) svg": {
          fill: palette.error.main,
        },
        "& input": {
          borderColor: palette.error.border,
          "&:hover": {
            borderColor: palette.error.border,
            boxShadow: "0px 0px 4px rgba(245, 34, 45, 0.5)",
          },
          "&:focus": {
            borderColor: palette.error.border,
            boxShadow: "0px 0px 4px rgba(245, 34, 45, 0.5)",
          },
        },
      },
      warning: {
        "& .right > *:nth-child(2) svg": {
          fill: palette.warning.main,
        },
        "& input": {
          borderColor: palette.warning.border,
          "&:hover": {
            borderColor: palette.warning.border,
            boxShadow: "0px 0px 4px rgba(250, 173, 20, 0.5)",
          },
          "&:focus": {
            borderColor: palette.warning.border,
            boxShadow: "0px 0px 4px rgba(250, 173, 20, 0.5)",
          },
        },
      },
      success: {
        "& .right > *:nth-child(2) svg": {
          fill: palette.success.main,
        },
      },
      caption: {
        display: "block",
        marginTop: constants.generalUnit / 4,
        transitionDuration: `${animation.transform}ms`,
        color: palette.additional["gray"][7],
        "&.error": {
          color: palette.error.main,
        },
        "&.warning": {
          color: palette.warning.main,
        },
        "&.default": {},
        "&.minimal": {
          position: "absolute",
          bottom: `calc(100% + ${constants.generalUnit * 1.5}px)`,
          width: "max-content",
          left: "50%",
          borderRadius: 2,
          textAlign: "center",
          padding: `${constants.generalUnit}px`,
          transform: "translateX(-50%)",
          color: palette.common.white.main,
          backgroundColor: palette.common.black.main,
          ...typography.body2,
          fontWeight: typography.fontWeight.bold,
          zIndex: zIndex?.layer3,
          "&:after": {
            display: "block",
            content: "''",
            position: "absolute",
            top: "100%",
            left: "50%",
            borderWidth: constants.generalUnit,
            borderStyle: "solid",
            borderColor: ` ${palette.common.black.main} transparent transparent transparent`,
          },
          "&.error": {
            // backgroundColor: palette.error.main,
          },
          "&.warning": {
            // backgroundColor: palette.warning.main,
          },
        },
        ...overrides?.TextInput?.caption,
      },
      warningIcon: {
        fill: palette.warning.main,
        "& svg": {
          fill: `${palette.warning.main} !important`,
        },
      },
      errorIcon: {
        fill: palette.error.main,
        "& svg": {
          fill: `${palette.error.main} !important`,
        },
      },
      successIcon: {
        fill: palette.success.main,
        "& svg": {
          fill: `${palette.success.main} !important`,
        },
      },
      label: {
        transitionDuration: `${animation.transform}ms`,
        display: "block",
        marginBottom: constants.generalUnit / 4,
        ...overrides?.TextInput?.label,
      },
      inputArea: {
        ...typography.body2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        transitionDuration: `${animation.transform}ms`,
        position: "relative",
        "&.large": {
          "& input": {
            fontSize: 16,
            lineHeight: "24px",
            padding: `${constants.generalUnit}px ${
              constants.generalUnit * 1.5
            }px`,
          },
          "&.iconLeft input": {
            paddingLeft:
              iconSize.large.height +
              iconSize.large.padding * 2 +
              constants.generalUnit * 1.5,
          },
          "&.success": {
            "& input": {
              paddingRight:
                iconSize.large.height +
                iconSize.large.padding +
                constants.generalUnit * 1.5,
            },
            "&.iconRight input": {
              paddingRight:
                iconSize.large.height * 2 +
                iconSize.large.padding +
                constants.generalUnit * 1.5,
            },
          },
          ...overrides?.TextInput?.inputArea?.size?.large,
        },
        "&.medium": {
          "& input": {
            padding: `${constants.generalUnit * 0.625}px ${
              constants.generalUnit * 1.5
            }px`,
            fontSize: 16,
            lineHeight: "20px",
          },
          "&.iconLeft input": {
            paddingLeft:
              iconSize.medium.height +
              iconSize.medium.padding * 2 +
              constants.generalUnit * 1.5,
          },
          "&.success": {
            "& input": {
              paddingRight:
                iconSize.medium.height +
                iconSize.medium.padding +
                constants.generalUnit * 1.5,
            },
            "&.iconRight input": {
              paddingRight:
                iconSize.medium.height * 2 +
                iconSize.medium.padding +
                constants.generalUnit * 1.5,
            },
          },
          ...overrides?.TextInput?.inputArea?.size?.medium,
        },
        "&.small": {
          "& input": {
            padding: `${constants.generalUnit / constants.generalUnit}px ${
              constants.generalUnit
            }px`,
          },
          "&.iconLeft input": {
            paddingLeft:
              iconSize.small.height +
              iconSize.small.padding * 2 +
              constants.generalUnit,
          },
          "&.success": {
            "& input": {
              paddingRight:
                iconSize.small.height +
                iconSize.small.padding * 2 +
                constants.generalUnit,
            },
            "&.iconRight input": {
              paddingRight:
                iconSize.small.height * 2 +
                iconSize.small.padding * 2 +
                constants.generalUnit,
            },
          },
          ...overrides?.TextInput?.inputArea?.size?.small,
        },
        "&.error": {
          "& input:focus": {
            backgroundColor: "unset",
          },
        },
        ...overrides?.TextInput?.inputArea?.root,
      },
      input: {
        width: "100%",
        padding: `${constants.generalUnit}px ${constants.generalUnit * 2}px`,
        outline: "none",
        border: `1px solid ${palette.additional["gray"][6]}`,
        color: palette.additional["gray"][10],
        transitionDuration: `${animation.transform}ms`,
      },
      standardIcon: {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        transitionDuration: `${animation.transform}ms`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& > span": {
          width: "auto",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "&:last-child": {
            marginLeft: 5,
          },
        },
        "&.left": {
          margin: 0,
        },
        "&.right": {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        },
        "& svg": {
          fill: palette.additional["gray"][7],
        },
        "&.large": {
          "&.left": {
            left: constants.generalUnit * 1.5,
            ...overrides?.TextInput?.icon?.size?.large?.left,
          },
          "&.right": {
            right: constants.generalUnit * 1.5,
            ...overrides?.TextInput?.icon?.size?.large?.right,
          },
          "& svg": {
            height: iconSize.large.height,
          },
          ...overrides?.TextInput?.icon?.size?.large?.root,
        },
        "&.medium": {
          "&.left": {
            left: iconSize.medium.padding,
            ...overrides?.TextInput?.icon?.size?.medium?.left,
          },
          "&.right": {
            right: iconSize.medium.padding,
            ...overrides?.TextInput?.icon?.size?.medium?.right,
          },
          "& svg": {
            height: iconSize.medium.height,
          },
          ...overrides?.TextInput?.icon?.size?.medium?.root,
        },
        "&.small": {
          "&.left": {
            left: iconSize.small.padding,
            ...overrides?.TextInput?.icon?.size?.small?.left,
          },
          "&.right": {
            right: iconSize.small.padding,
            ...overrides?.TextInput?.icon?.size?.small?.right,
          },
          "& svg": {
            height: iconSize.small.height,
          },
          ...overrides?.TextInput?.icon?.size?.small?.root,
        },
        ...overrides?.TextInput?.icon?.root,
      },
    }),
)

export type InputState = "normal" | "warning" | "success" | "error"

export interface ITextInputProps
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    "onChange" | "label" | "size" | "value"
  > {
  className?: string
  label?: string
  labelClassName?: string
  name?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  LeftIcon?: typeof SvgIcon
  RightIcon?: typeof SvgIcon
  state?: InputState
  inputVariant?: "default" | "minimal"
  size?: "large" | "medium" | "small"
  captionMessage?: string | ReactNode
  onChange: (value: string | number | undefined) => void
  type?: "text" | "email" | "password" | "url" | "search"
  autoFocus?: boolean
}

const TextInput = React.forwardRef(
  (
    {
      className,
      label,
      LeftIcon,
      RightIcon,
      name,
      value,
      onChange,
      inputVariant = "default",
      labelClassName,
      size = "medium",
      type = "text",
      placeholder,
      captionMessage,
      state = "normal",
      disabled = false,
      autoFocus = false,
      ...rest
    }: ITextInputProps,
    forwardedRef: any,
  ) => {
    const classes = useStyles()
    return (
      <label
        className={clsx(classes.root, className, size, {
          ["disabled"]: disabled,
          [classes.error]: state == "error",
          [classes.warning]: state == "warning",
          [classes.success]: state == "success",
        })}
      >
        {inputVariant === "default" && label && label.length > 0 && (
          <Typography
            variant="body2"
            component="span"
            className={clsx(classes.label, labelClassName, {
              ["error"]: state == "error",
              ["success"]: state == "success",
              ["warning"]: state == "warning",
            })}
          >
            {label}
          </Typography>
        )}
        <div
          className={clsx(classes.inputArea, size, {
            ["iconLeft"]: LeftIcon,
            ["iconRight"]: RightIcon,
          })}
        >
          {LeftIcon && (
            <LeftIcon className={clsx(classes.standardIcon, size, "left")} />
          )}
          <input
            className={clsx(classes.input, {
              ["disabled"]: disabled,
              ["error"]: state == "error",
              ["success"]: state == "success",
              ["warning"]: state == "warning",
            })}
            type={type}
            disabled={disabled}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={autoFocus}
            ref={forwardedRef}
            {...rest}
          />
          <div className={clsx(classes.standardIcon, size, "right")}>
            {RightIcon && <RightIcon />}
            {state == "warning" && (
              <ExclamationCircleIcon className={classes.warningIcon} />
            )}
            {state == "error" && (
              <CloseCircleIcon className={classes.errorIcon} />
            )}
            {state == "success" && (
              <CheckCircleIcon className={classes.successIcon} />
            )}
          </div>
        </div>
        {captionMessage && (
          <Typography
            variant="body2"
            component="span"
            className={clsx(classes.caption, inputVariant, {
              ["error"]: state == "error",
              ["success"]: state == "success",
              ["warning"]: state == "warning",
            })}
          >
            {captionMessage}
          </Typography>
        )}
      </label>
    )
  },
)

export default TextInput
