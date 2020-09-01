import React, { FormEvent } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"
import Typography from "../Typography"
import { CheckboxActive, CheckboxInactive } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      ...theme.typography.body2,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    input: {
      visibility: "hidden",
      display: "none",
      opacity: 0,
    },
    checkbox: {
      stroke: theme.palette["gray"][5],
      paddingRight: theme.constants.generalUnit,
      "&:hover": {
        stroke: theme.palette.primary.main,
      },
    },
    checkboxActive: {
      fill: theme.palette.primary.main,
      stroke: theme.palette.primary.main,
      paddingRight: theme.constants.generalUnit,
      "& svg > path": {
        fill: theme.palette.common.white.main,
        stroke: theme.palette.common.white.main,
      },
    },
    checkboxDisabled: {
      fill: theme.palette["gray"][3],
      stroke: theme.palette["gray"][5],
      paddingRight: theme.constants.generalUnit,
      "& svg": {
        fill: theme.palette["gray"][3],
        "& path": {
          fill: theme.palette["gray"][6],
          stroke: theme.palette["gray"][6],
        },
      },
      "&:hover": {
        stroke: theme.palette["gray"][5],
      },
    },
    label: {
      cursor: "pointer",
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
  onChange(event: FormEvent<HTMLInputElement>): void
}

const CheckboxInput: React.FC<ICheckboxProps> = ({
  className,
  label,
  onChange,
  disabled,
  value,
  error,
  ...props
}) => {
  const classes = useStyles()

  const handleChange = (event: any) => {
    !disabled && onChange(event)
  }

  return (
    <div className={clsx(classes.root, className)}>
      <input
        type="checkbox"
        style={{ display: "none", visibility: "hidden" }}
        {...props}
        checked={value}
        onChange={() => {}}
      />
      {value ? (
        <CheckboxActive
          className={clsx(
            classes.checkboxActive,
            disabled && classes.checkboxDisabled,
          )}
          onClick={handleChange}
        />
      ) : (
        <CheckboxInactive
          className={clsx(
            classes.checkbox,
            disabled && classes.checkboxDisabled,
          )}
          onClick={handleChange}
        />
      )}
      {label && (
        <label
          className={clsx(classes.label, disabled && classes.labelDisabled)}
        >
          <Typography>{label}</Typography>
        </label>
      )}
      <br />
      {error && <div className={classes.error}>{error}</div>}
    </div>
  )
}

export default CheckboxInput

export { ICheckboxProps }
