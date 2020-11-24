import React, { FormEvent } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Typography } from "../Typography"
import { CheckIcon } from "../Icons"

const useStyles = makeStyles(
  ({ constants, palette, animation, typography, overrides }: ITheme) =>
    createStyles({
      root: {
        cursor: "pointer",
        display: "flex",
        ...overrides?.CheckboxInput?.root,
      },
      checkbox: {
        position: "relative",
        marginRight: constants.generalUnit,
        border: `1px solid ${palette.additional["gray"][5]}`,
        borderRadius: 2,
        height: constants.generalUnit * 2,
        width: constants.generalUnit * 2,
        transitionDuration: `${animation.transform}ms`,
        "& span > svg": {
          fill: palette.common.white.main,
          display: "block",
          height: constants.generalUnit * 2,
          width: constants.generalUnit * 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transitionDuration: `${animation.transform}ms`,
          transform: "translate(-50%,-50%)",
          opacity: 0,
        },
        "&:hover": {
          borderColor: palette.primary.main,
          ...overrides?.CheckboxInput?.checkbox?.hover,
        },
        "&.checked": {
          borderColor: palette.primary.main,
          backgroundColor: palette.primary.main,
          "& span > svg": {
            opacity: 1,
          },
          ...overrides?.CheckboxInput?.checkbox?.checked,
        },
        "&.disabled": {
          borderColor: palette.additional["gray"][5],
          backgroundColor: palette.additional["gray"][3],
          "& span > svg": {
            fill: palette.additional["gray"][6],
          },
          "&:before": {
            backgroundColor: palette.additional["gray"][6],
          },
          "&:hover": {
            borderColor: palette.additional["gray"][5],
          },
          ...overrides?.CheckboxInput?.checkbox?.disabled,
        },
        "&:before": {
          content: "''",
          display: "block",
          height: constants.generalUnit,
          width: constants.generalUnit,
          position: "absolute",
          backgroundColor: palette.primary.main,
          top: "50%",
          left: "50%",
          transitionDuration: `${animation.transform}ms`,
          transform: "translate(-50%,-50%)",
          opacity: 0,
        },
        "&.indeterminate": {
          "&:before": {
            opacity: 1,
          },
        },
        ...overrides?.CheckboxInput?.checkbox?.root,
      },
      input: {
        visibility: "hidden",
        display: "none",
        opacity: 0,
        ...overrides?.CheckboxInput?.input,
      },
      label: {
        ...typography.body2,
        ...overrides?.CheckboxInput?.label,
      },
      labelDisabled: {
        color: palette.additional["gray"][6],
        ...overrides?.CheckboxInput?.labelDisabled,
      },
      error: {
        color: palette.error.main,
        ...overrides?.CheckboxInput?.error,
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
