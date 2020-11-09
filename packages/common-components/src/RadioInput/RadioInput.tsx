import React from "react"
import { makeStyles, createStyles, ITheme } from "@imploy/common-themes"
import clsx from "clsx"
import { Typography } from "../Typography"

const useStyles = makeStyles(
  ({ constants, palette, animation, typography, overrides }: ITheme) =>
    createStyles({
      radioContainer: {
        display: "flex",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
        paddingLeft: constants.generalUnit * 3,
        paddingRight: constants.generalUnit * 3,
        margin: `${constants.generalUnit}px 0`,
        ...overrides?.RadioInput?.radioContainer,
      },
      radioInput: {
        display: "none",
        visibility: "hidden",
        ...overrides?.RadioInput?.radioInput,
      },
      radio: {
        border: `1px solid ${palette.additional["gray"][6]}`,
        position: "absolute",
        width: constants.generalUnit * 2,
        height: constants.generalUnit * 2,
        left: 0,
        top: 0,
        borderRadius: "50%",
        transition: `all ${animation.transform}ms ease`,
        ...overrides?.RadioInput?.radio?.root,
        "&:before": {
          content: "''",
          display: "block",
          height: constants.generalUnit,
          width: constants.generalUnit,
          position: "absolute",
          top: "50%",
          left: "50%",
          transitionDuration: `${animation.transform}ms`,
          transform: "translate(-50%,-50%) scale(0)",
          borderRadius: "50%",
        },
        "&.checked": {
          border: `1px solid ${palette.additional["blue"][6]}`,
          ...overrides?.RadioInput?.radio?.checked,
          "&:before": {
            content: "''",
            display: "block",
            height: constants.generalUnit,
            width: constants.generalUnit,
            position: "absolute",
            backgroundColor: palette.additional["blue"][6],
            top: "50%",
            left: "50%",
            transitionDuration: `${animation.transform}ms`,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
          },
        },
        "&.disabled": {
          ...overrides?.RadioInput?.radio?.disabled,
        },
      },
      label: {
        ...typography.body2,
        ...overrides?.RadioInput?.label,
      },
      labelDisabled: {
        cursor: "not-allowed",
        color: palette.additional["gray"][6],
        ...overrides?.RadioInput?.labelDisabled,
      },
      error: {
        color: palette.error.main,
        ...overrides?.RadioInput?.error,
      },
    }),
)

export interface IRadioInputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  value: string
  label?: string
  name?: string
  checked?: boolean
  disabled?: boolean
  error?: string
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void
}

const RadioInput: React.FC<IRadioInputProps> = ({
  className,
  value,
  name,
  label,
  checked,
  disabled,
  onChange,
  error,
  ...props
}) => {
  const classes = useStyles()

  return (
    <>
      <label
        className={clsx(
          classes.radioContainer,
          disabled && classes.labelDisabled,
          className,
        )}
      >
        <input
          type="radio"
          value={value}
          disabled={disabled}
          onChange={onChange}
          name={name}
          checked={checked}
          className={classes.radioInput}
          {...props}
        />
        <div
          className={clsx(classes.radio, {
            ["checked"]: checked,
            ["disabled"]: disabled,
          })}
        />
        {label && (
          <Typography className={clsx(classes.label)}>{label}</Typography>
        )}
      </label>
      {error && <div className={classes.error}>{error}</div>}
    </>
  )
}

export default RadioInput
