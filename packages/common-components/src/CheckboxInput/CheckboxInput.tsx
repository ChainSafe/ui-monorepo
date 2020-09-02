import React, { FormEvent } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"
import Typography from "../Typography"
import { CheckIcon } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      cursor: "pointer",
      display: "flex",
    },
    checkbox: {
      position: "relative",
      marginRight: theme.constants.generalUnit,
      border: `1px solid ${theme.palette["gray"][5]}`,
      borderRadius: 2,
      height: theme.constants.generalUnit * 2,
      width: theme.constants.generalUnit * 2,
      transitionDuration: `${theme.animation.transform}ms`,
      "& span > svg": {
        fill: theme.palette.common.white.main,
        display: "block",
        height: theme.constants.generalUnit * 2,
        width: theme.constants.generalUnit * 2,
        position: "absolute",
        top: "50%",
        left: "50%",
        transitionDuration: `${theme.animation.transform}ms`,
        transform: "translate(-50%,-50%)",
        opacity: 0,
      },
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      "&.checked": {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        "& span > svg": {
          opacity: 1,
        },
      },
      "&.disabled": {
        borderColor: theme.palette["gray"][5],
        backgroundColor: theme.palette["gray"][3],
        "& span > svg": {
          fill: theme.palette["gray"][6],
        },
        "&:before": {
          backgroundColor: theme.palette["gray"][6],
        },
      },
      "&:before": {
        content: "''",
        display: "block",
        height: theme.constants.generalUnit,
        width: theme.constants.generalUnit,
        position: "absolute",
        backgroundColor: theme.palette.primary.main,
        top: "50%",
        left: "50%",
        transitionDuration: `${theme.animation.transform}ms`,
        transform: "translate(-50%,-50%)",
        opacity: 0,
      },
      "&.indeterminate": {
        "&:before": {
          opacity: 1,
        },
      },
    },
    input: {
      visibility: "hidden",
      display: "none",
      opacity: 0,
    },
    label: {
      ...theme.typography.body2,
    },
    labelDisabled: {
      color: theme.palette["gray"][6],
    },
    error: {
      color: theme.palette.error.main,
    },
  }),
)

interface ICheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "value"> {
  className?: string
  label?: string
  error?: string
  value: boolean
  indeterminate?: boolean
  onChange(event: FormEvent<HTMLInputElement>): void
}

const CheckboxInput: React.FC<ICheckboxProps> = ({
  className,
  label,
  onChange,
  disabled,
  indeterminate = false,
  value,
  error,
  ...props
}) => {
  const classes = useStyles(props)

  const handleChange = (event: any) => {
    !disabled && onChange(event)
  }

  return (
    <label className={clsx(classes.root, className)}>
      <input
        type="checkbox"
        {...props}
        checked={value}
        onChange={handleChange}
        className={classes.input}
      />
      <div
        className={clsx(classes.checkbox, {
          ["checked"]: value,
          ["disabled"]: disabled,
          ["indeterminate"]: indeterminate,
        })}
      >
        <CheckIcon />
      </div>
      {label && (
        <Typography
          className={clsx(classes.label, disabled && classes.labelDisabled)}
        >
          {label}
        </Typography>
      )}
      <br />
      {error && <div className={classes.error}>{error}</div>}
    </label>
  )
}

export default CheckboxInput
export { ICheckboxProps }
