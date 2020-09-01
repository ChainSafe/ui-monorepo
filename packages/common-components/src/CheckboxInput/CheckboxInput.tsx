import React from "react"
import { useField } from "formik"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"
import Typography from "../Typography"
import { CheckboxActive, CheckboxInactive } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      cursor: "pointer",
    },
    input: {
      visibility: "hidden",
      display: "none",
      opacity: 0,
    },
    checkbox: {
      stroke: theme.palette["gray"][5],
      paddingRight: theme.constants.generalUnit,
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
    },
    label: {
      cursor: "pointer",
    },
    error: {
      color: theme.palette.error.main,
    },
  }),
)

interface ICheckboxProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  name: string
  label?: string
}

const CheckboxInput: React.FC<ICheckboxProps> = ({
  className,
  name,
  label,
  onChange,
  disabled,
  ...props
}) => {
  const classes = useStyles()
  const [value, meta, helpers] = useField<boolean>(name)

  const updateValue = () => {
    !disabled && helpers.setValue(!value.value)
  }

  return (
    <div className={clsx(classes.root, className)} onClick={updateValue}>
      <input
        type="checkbox"
        style={{ display: "none", visibility: "hidden" }}
        {...props}
        checked={value.value}
        onChange={updateValue}
      />
      {value.value ? (
        <CheckboxActive
          className={clsx(
            classes.checkboxActive,
            disabled && classes.checkboxDisabled,
          )}
        />
      ) : (
        <CheckboxInactive
          className={clsx(
            classes.checkbox,
            disabled && classes.checkboxDisabled,
          )}
        />
      )}
      {label && (
        <label onClick={updateValue} className={classes.label}>
          <Typography>{label}</Typography>
        </label>
      )}
      <br />
      {meta.error && <div className={classes.error}>{meta.error}</div>}
    </div>
  )
}

export default CheckboxInput

export { ICheckboxProps }
