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
      color: theme.palette["gray"][7],
    },
    label: {
      display: "block",
    },
    inputArea: {
      ...theme.typography.body2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      "& input": {
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
        fontSize: 16,
        lineHeight: 24,
        padding: `${theme.constants.generalUnit}px ${
          theme.constants.generalUnit * 1.5
        }px`,
      },
      "&.medium": {
        padding: `${theme.constants.generalUnit / 0.625}px ${
          theme.constants.generalUnit * 1.5
        }px`,
      },
      "&.small": {
        padding: `${
          theme.constants.generalUnit / theme.constants.generalUnit
        }px ${theme.constants.generalUnit}px`,
        "&.success": {
          paddingRight: iconSize.small + theme.constants.generalUnit,
          "&.iconRight": {
            paddingRight: iconSize.small + theme.constants.generalUnit,
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
      {label && (
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
