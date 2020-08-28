/**
 *
 * TextInput
 *
 */

import React, { ChangeEvent } from "react"
import { FieldProps } from "formik"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import Typography from "../Typography"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {},
    error: {
      display: "block",
      marginTop: 5,
    },
    label: {
      display: "block",
    },
    input: {
      ...theme.typography.body2,
      width: "100%",
      padding: `${theme.constants.generalUnit}px ${theme.constants.generalUnit *
        2}px`,
      outline: "none",
      border: `1px solid ${theme.palette["gray"][6]}`,
      color: theme.palette["gray"][10],
      transitionDuration: `${theme.animation.transform}ms`,
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
  }),
)

interface OwnProps extends FieldProps {
  className?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  tooltip?: string
  optional?: boolean
  type?: "text" | "email" | "password" | "url" | "search"
}

const TextInput: React.SFC<OwnProps> = ({
  className,
  field,
  form: { errors, setFieldValue },
  label = field.name,
  type = "text",
  placeholder,
  disabled = false,
}: OwnProps) => {
  const classes = useStyles()
  const error = errors[field.name]
  return (
    <label
      className={clsx(classes.label, className, disabled ? "disabled" : "")}
    >
      <input
        className={clsx(
          classes.input,
          disabled ? "disabled" : "",
          error ? "error" : "",
        )}
        type={type}
        name={field.name}
        value={field.value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFieldValue(field.name, e.target?.value)
        }}
      />
      {error && (
        <Typography variant="body2" component="span" className={classes.error}>
          {error}
        </Typography>
      )}
    </label>
  )
}

export default TextInput
