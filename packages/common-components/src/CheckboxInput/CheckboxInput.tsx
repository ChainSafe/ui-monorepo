import React, { ChangeEvent } from "react"
import { useField } from "formik"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {},
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
  ...props
}) => {
  const classes = useStyles()
  const [value, meta, helpers] = useField<boolean>(name)

  const updateValue = (event: ChangeEvent<HTMLInputElement>) =>
    helpers.setValue(event.target.checked)

  return (
    <div className={clsx(classes.root, className)}>
      {label && <label>{label}</label>}
      <input
        type="checkbox"
        {...props}
        onChange={updateValue}
        checked={value.checked}
      />
      {meta.error && <div className={classes.error}>{meta.error}</div>}
    </div>
  )
}

export default CheckboxInput

export { ICheckboxProps }
