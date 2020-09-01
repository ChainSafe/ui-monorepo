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
  ...props
}) => {
  const classes = useStyles()
  const [value, meta, helpers] = useField<boolean>(name)

  const updateValue = () => {
    helpers.setValue(!value.value)
  }

  return (
    <div className={clsx(classes.root, className)} onClick={updateValue}>
      <input
        type="checkbox"
        id="checkbox"
        style={{ display: "none", visibility: "hidden" }}
        {...props}
        checked={value.value}
        onChange={updateValue}
      />
      {value.value ? <CheckboxActive /> : <CheckboxInactive />}
      {label && (
        <label onClick={updateValue}>
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
