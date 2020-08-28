/**
 *
 * TextInput
 *
 */

import React, { ChangeEvent, ReactNode, Fragment } from "react"
import { FieldProps } from "formik"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import Typography from "../Typography"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      ...theme.typography.body2,
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
      "&:hover": {
        // borderColor: theme.palette
      },
      "&:focus": {
        // borderColor: theme.palette
      },
      "&.error": {
        // borderColor: theme.palette.danger1,
        // backgroundColor: theme.palette.functional.danger2,
        "&:focus": {
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
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  state?: INPUT_STATE
  captionMessage?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: "text" | "email" | "password" | "url" | "search"
}

const TextInput: React.SFC<OwnProps> = ({
  className,
  label,
  leftIcon,
  rightIcon,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  captionMessage,
  state = INPUT_STATE.NORMAL,
  disabled = false,
}: OwnProps) => {
  const classes = useStyles()
  return (
    <label
      className={clsx(
        classes.label,
        className,
        disabled && "disabled",
        state == INPUT_STATE.ERROR && classes.error,
        state == INPUT_STATE.WARNING && classes.warning,
        state == INPUT_STATE.SUCCESS && classes.success,
      )}
    >
      {label && (
        <Typography variant="body2" component="span" className={classes.label}>
          {label}
        </Typography>
      )}
      <div className={classes.inputArea}>
        {leftIcon && <Fragment>{leftIcon}</Fragment>}
        <input
          className={clsx(
            classes.input,
            disabled ? "disabled" : "",
            state == INPUT_STATE.ERROR ? "error" : "",
          )}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {rightIcon && <Fragment>{rightIcon}</Fragment>}
        {state == INPUT_STATE.WARNING && <Fragment></Fragment>}
        {state == INPUT_STATE.ERROR && <Fragment></Fragment>}
        {state == INPUT_STATE.SUCCESS && <Fragment></Fragment>}
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
