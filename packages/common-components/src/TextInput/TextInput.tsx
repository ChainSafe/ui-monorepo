/**
 *
 * TextInput
 *
 */

import React, { ChangeEvent, Fragment } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import Typography from "../Typography"
import clsx from "clsx"
import SvgIcon from "../Icons"

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
      "&.large": {
        fontSize: 14,
        lineHeight: 22,
      },
      "&.medium": {
        fontSize: 14,
        lineHeight: 22,
      },
      "&.small": {
        fontSize: 14,
        lineHeight: 22,
      },
    },
    success: {},
    warning: {},
    error: {},
    caption: {
      display: "block",
      marginTop: 5,
      transitionDuration: `${theme.animation.transform}ms`,
      color: theme.palette["gray"][7],
    },
    label: {
      transitionDuration: `${theme.animation.transform}ms`,
      display: "block",
    },
    inputArea: {
      ...theme.typography.body2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      transitionDuration: `${theme.animation.transform}ms`,
      position: "relative",
      "& input": {
        transitionDuration: `${theme.animation.transform}ms`,
        border: "none",
        display: "block",
        "&:hover": {
          // borderColor: theme.palette
        },
        "&:focus": {
          // borderColor: theme.palette
        },
      },
      "&.large": {
        "& input": {
          fontSize: 16,
          lineHeight: 24,
          padding: `${theme.constants.generalUnit}px ${
            theme.constants.generalUnit * 1.5
          }px`,
        },
        "&.iconLeft input": {
          paddingLeft: iconSize.large.height + iconSize.large.padding * 2,
        },
        "&.success": {
          "& input": {
            paddingRight: iconSize.large.height + iconSize.large.padding * 2,
          },
          "&.iconRight input": {
            paddingRight:
              iconSize.large.height * 2 + iconSize.large.padding * 3,
          },
        },
      },
      "&.medium": {
        "& input": {
          padding: `${theme.constants.generalUnit / 0.625}px ${
            theme.constants.generalUnit * 1.5
          }px`,
        },
        "&.iconLeft input": {
          paddingLeft: iconSize.medium.height + iconSize.medium.padding * 2,
        },
        "&.success": {
          "& input": {
            paddingRight: iconSize.medium.height + iconSize.medium.padding * 2,
          },
          "&.iconRight input": {
            paddingRight:
              iconSize.medium.height * 2 + iconSize.medium.padding * 3,
          },
        },
      },
      "&.small input": {
        padding: `${
          theme.constants.generalUnit / theme.constants.generalUnit
        }px ${theme.constants.generalUnit}px`,
        "&.iconLeft input": {
          paddingLeft: iconSize.small.height + iconSize.small.padding * 2,
        },
        "&.success": {
          "& input": {
            paddingRight: iconSize.small.height + iconSize.small.padding * 2,
          },
          "&.iconRight input": {
            paddingRight:
              iconSize.small.height * 2 + iconSize.small.padding * 3,
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
      border: `1px solid ${theme.palette["gray"][6]}`,
      color: theme.palette["gray"][10],
      transitionDuration: `${theme.animation.transform}ms`,
    },
    standardIcon: {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%,0)",
      transitionDuration: `${theme.animation.transform}ms`,
      "& svg": {
        fill: theme.palette["gray"][7],
      },
      "&.large": {
        "& svg": {
          height: iconSize.large.height,
        },
      },
      "&.medium": {
        "& svg": {
          height: iconSize.medium.height,
        },
      },
      "&.small": {
        "& svg": {
          height: iconSize.small.height,
        },
      },
    },
  }),
)

export enum INPUT_STATE {
  NORMAL = "NORMAL",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface OwnProps {
  className?: string
  label?: string
  name?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  LeftIcon?: typeof SvgIcon
  RightIcon?: typeof SvgIcon
  state?: INPUT_STATE
  size?: "large" | "medium" | "small"
  captionMessage?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: "text" | "email" | "password" | "url" | "search"
}

const TextInput: React.SFC<OwnProps> = ({
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
  state = INPUT_STATE.NORMAL,
  disabled = false,
}: OwnProps) => {
  const classes = useStyles()
  return (
    <label
      className={clsx(classes.root, className, size, {
        ["disabled"]: disabled,
        [classes.error]: state == INPUT_STATE.ERROR,
        [classes.warning]: state == INPUT_STATE.WARNING,
        [classes.success]: state == INPUT_STATE.SUCCESS,
      })}
    >
      {label && label.length > 0 && (
        <Typography variant="body2" component="span" className={classes.label}>
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
            ["error"]: state == INPUT_STATE.ERROR,
            ["success"]: state == INPUT_STATE.SUCCESS,
            ["warning"]: state == INPUT_STATE.WARNING,
          })}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        <div className={clsx(classes.standardIcon, size, "right")}>
          {RightIcon && <RightIcon />}
          {state == INPUT_STATE.WARNING && <Fragment></Fragment>}
          {state == INPUT_STATE.ERROR && <Fragment></Fragment>}
          {state == INPUT_STATE.SUCCESS && <Fragment></Fragment>}
        </div>
      </div>
      {captionMessage && (
        <Typography
          variant="body2"
          component="span"
          className={classes.caption}
        >
          {captionMessage}
        </Typography>
      )}
    </label>
  )
}

export default TextInput
