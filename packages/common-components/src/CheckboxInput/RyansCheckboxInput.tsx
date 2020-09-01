/**
 *
 * BoolCheckboxInput
 *
 */
import React from "react"

import { createStyles, makeStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"
import { useField } from "formik"
import { Typography } from ".."
import { CheckboxActive, CheckboxInactive } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      cursor: "pointer",
      margin: 10,
      display: "block",
    },
    input: {
      visibility: "hidden",
      opacity: 0,
      display: "none",
    },
    checkIcon: {
      position: "relative",
      marginRight: theme.constants.generalUnit,
      "&.error": {
        "& svg": {
          fill: `${theme.palette.primary.main}`,
        },
      },
      "& svg": {
        height: 18,
        width: 18,
        fill: `${theme.palette["gray"][6]}`,
      },
      "& svg:last-child": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        fill: `${theme.palette.primary.main}`,
        transitionDuration: 200,
        opacity: 0,
        visibility: "hidden",
      },
      "&.checked svg:last-child": {
        opacity: 1,
        visibility: "visible",
      },
    },
    text: {
      color: theme.palette["gray"][9],
      "&.error": {
        color: `${theme.palette.error.main} !important`,
      },
    },
    error: {
      display: "block",
      marginTop: 5,
      color: theme.palette.error.main,
    },
    comp: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
  }),
)

interface ICheckboxProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  name: string
  label?: string
}

const BoolCheckboxInput: React.FC<ICheckboxProps> = ({
  label,
  className,
  disabled,
  name,
}) => {
  const classes = useStyles()
  const [value, meta, helpers] = useField<boolean>(name)
  return (
    <label
      className={clsx(
        classes.root,
        className,
        disabled && "disabled",
        meta.error && "error",
      )}
    >
      <section className={classes.comp}>
        <input
          name={name}
          className={classes.input}
          type="checkbox"
          checked={value.checked}
          onClick={() => helpers.setValue(!value.checked)}
        />
        <div
          className={clsx(
            classes.checkIcon,
            value.checked && "checked",
            meta.error && "error",
          )}
        >
          <CheckboxActive />
          <CheckboxInactive />
        </div>
        <Typography className={clsx(classes.text)} variant="body2">
          {label}
        </Typography>
      </section>
      {meta.error && (
        <Typography variant="body2" className={classes.error}>
          {meta.error}
        </Typography>
      )}
    </label>
  )
}
export default BoolCheckboxInput
export { ICheckboxProps }
