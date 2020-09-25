import React, { ChangeEvent } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import { ITheme } from "@chainsafe/common-themes"
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

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      ...theme.typography.body2,
      margin: "1px",
      cursor: "pointer",
      "&.large": {
        fontSize: 14,
        lineHeight: "22px",
      },
      "&.medium": {
        fontSize: 14,
        lineHeight: "22px",
      },
      "&.small": {
        fontSize: 14,
        lineHeight: "22px",
      },
      "& .right > *:nth-child(2) svg": {
        fill: theme.palette.primary.main,
      },
      "& input": {
        transitionDuration: `${theme.animation.transform}ms`,
        display: "block",
        color: theme.palette.additional["gray"][8],
        borderRadius: 2,
        "&:hover": {
          borderColor: theme.palette.primary.border,
        },
        "&:focus": {
          borderColor: theme.palette.primary.border,
          // borderColor: theme.palette
          boxShadow: "0px 0px 4px rgba(24, 144, 255, 0.5)",
        },
      },
      "&.disabled": {
        "& input": {
          color: theme.palette.additional["gray"][6],
          backgroundColor: theme.palette.additional["gray"][3],
        },
      },
    },
    error: {
      "& .right > *:nth-child(2) svg": {
        fill: theme.palette.error.main,
      },
      "& input": {
        borderColor: theme.palette.error.border,
        "&:hover": {
          borderColor: theme.palette.error.border,
          boxShadow: "0px 0px 4px rgba(245, 34, 45, 0.5)",
        },
        "&:focus": {
          borderColor: theme.palette.error.border,
          boxShadow: "0px 0px 4px rgba(245, 34, 45, 0.5)",
        },
      },
    },
    warning: {
      "& .right > *:nth-child(2) svg": {
        fill: theme.palette.warning.main,
      },
      "& input": {
        borderColor: theme.palette.warning.border,
        "&:hover": {
          borderColor: theme.palette.warning.border,
          boxShadow: "0px 0px 4px rgba(250, 173, 20, 0.5)",
        },
        "&:focus": {
          borderColor: theme.palette.warning.border,
          boxShadow: "0px 0px 4px rgba(250, 173, 20, 0.5)",
        },
      },
    },
    success: {
      "& .right > *:nth-child(2) svg": {
        fill: theme.palette.success.main,
      },
    },
    caption: {
      display: "block",
      marginTop: theme.constants.generalUnit / 4,
      transitionDuration: `${theme.animation.transform}ms`,
      color: theme.palette.additional["gray"][7],
      "&.error": {
        color: theme.palette.error.main,
      },
      "&.warning": {
        color: theme.palette.warning.main,
      },
    },
    label: {
      transitionDuration: `${theme.animation.transform}ms`,
      display: "block",
      marginBottom: theme.constants.generalUnit / 4,
    },
    inputArea: {
      ...theme.typography.body2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      transitionDuration: `${theme.animation.transform}ms`,
      position: "relative",
      "&.large": {
        "& input": {
          fontSize: 16,
          lineHeight: "24px",
          padding: `${theme.constants.generalUnit}px ${
            theme.constants.generalUnit * 1.5
          }px`,
        },
        "&.iconLeft input": {
          paddingLeft:
            iconSize.large.height +
            iconSize.large.padding * 2 +
            theme.constants.generalUnit * 1.5,
        },
        "&.success": {
          "& input": {
            paddingRight:
              iconSize.large.height +
              iconSize.large.padding +
              theme.constants.generalUnit * 1.5,
          },
          "&.iconRight input": {
            paddingRight:
              iconSize.large.height * 2 +
              iconSize.large.padding +
              theme.constants.generalUnit * 1.5,
          },
        },
      },
      "&.medium": {
        "& input": {
          fontSize: 16,
          lineHeight: "20px",
          padding: `${theme.constants.generalUnit * 0.625}px ${
            theme.constants.generalUnit * 1.5
          }px`,
        },
        "&.iconLeft input": {
          paddingLeft:
            iconSize.medium.height +
            iconSize.medium.padding * 2 +
            theme.constants.generalUnit * 1.5,
        },
        "&.success": {
          "& input": {
            paddingRight:
              iconSize.medium.height +
              iconSize.medium.padding +
              theme.constants.generalUnit * 1.5,
          },
          "&.iconRight input": {
            paddingRight:
              iconSize.medium.height * 2 +
              iconSize.medium.padding +
              theme.constants.generalUnit * 1.5,
          },
        },
      },
      "&.small": {
        "& input": {
          padding: `${
            theme.constants.generalUnit / theme.constants.generalUnit
          }px ${theme.constants.generalUnit}px`,
        },
        "&.iconLeft input": {
          paddingLeft:
            iconSize.small.height +
            iconSize.small.padding * 2 +
            theme.constants.generalUnit,
        },
        "&.success": {
          "& input": {
            paddingRight:
              iconSize.small.height +
              iconSize.small.padding * 2 +
              theme.constants.generalUnit,
          },
          "&.iconRight input": {
            paddingRight:
              iconSize.small.height * 2 +
              iconSize.small.padding * 2 +
              theme.constants.generalUnit,
          },
        },
      },
      "&.error": {
        "& input:focus": {
          backgroundColor: "unset",
        },
      },
    },
    input: {
      width: "100%",
      padding: `${theme.constants.generalUnit}px ${
        theme.constants.generalUnit * 2
      }px`,
      outline: "none",
      border: `1px solid ${theme.palette.additional["gray"][6]}`,
      color: theme.palette.additional["gray"][10],
      transitionDuration: `${theme.animation.transform}ms`,
    },
    standardIcon: {
      position: "absolute",
      top: "50%",
      transform: "translate(0, -50%)",
      transitionDuration: `${theme.animation.transform}ms`,
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
        fill: theme.palette.additional["gray"][7],
      },
      "&.large": {
        "&.left": {
          left: theme.constants.generalUnit * 1.5,
        },
        "&.right": {
          right: theme.constants.generalUnit * 1.5,
        },
        "& svg": {
          height: iconSize.large.height,
        },
      },
      "&.medium": {
        "&.left": {
          left: iconSize.medium.padding,
        },
        "&.right": {
          right: iconSize.medium.padding,
        },
        "& svg": {
          height: iconSize.medium.height,
        },
      },
      "&.small": {
        "&.left": {
          left: iconSize.small.padding,
        },
        "&.right": {
          right: iconSize.small.padding,
        },
        "& svg": {
          height: iconSize.small.height,
        },
      },
    },
  }),
)

export type InputState = "normal" | "warning" | "success" | "error"

export interface TextInputProps {
  className?: string
  label?: string
  name?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  LeftIcon?: typeof SvgIcon
  RightIcon?: typeof SvgIcon
  state?: InputState
  size?: "large" | "medium" | "small"
  captionMessage?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: "text" | "email" | "password" | "url" | "search"
}

const TextInput: React.FC<TextInputProps> = ({
  className,
  label,
  LeftIcon,
  RightIcon,
  name,
  value,
  onChange,
  size = "medium",
  type = "text",
  placeholder,
  captionMessage,
  state = "normal",
  disabled = false,
}: TextInputProps) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(classes.root, className, size, {
        ["disabled"]: disabled,
        [classes.error]: state == "error",
        [classes.warning]: state == "warning",
        [classes.success]: state == "success",
      })}
    >
      {label && label.length > 0 && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.label, {
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
          onChange={onChange}
        />
        <div className={clsx(classes.standardIcon, size, "right")}>
          {RightIcon && <RightIcon />}
          {state == "warning" && <ExclamationCircleIcon />}
          {state == "error" && <CloseCircleIcon />}
          {state == "success" && <CheckCircleIcon />}
        </div>
      </div>
      {captionMessage && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.caption, {
            ["error"]: state == "error",
            ["success"]: state == "success",
            ["warning"]: state == "warning",
          })}
        >
          {captionMessage}
        </Typography>
      )}
    </div>
  )
}

export default TextInput
