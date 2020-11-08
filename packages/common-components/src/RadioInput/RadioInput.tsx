import React from "react"
import { makeStyles, createStyles, ITheme } from "@imploy/common-themes"
import clsx from "clsx"
import { Typography } from "../Typography"

const useStyles = makeStyles(
  ({ constants, palette, animation, typography }: ITheme) =>
    createStyles({
      radioContainer: {
        display: "flex",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
        paddingLeft: constants.generalUnit * 3,
        paddingRight: constants.generalUnit * 3,
        margin: `${constants.generalUnit}px 0`,
      },
      radioInput: {
        display: "none",
        visibility: "hidden",
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
      },
      label: {
        ...typography.body2,
      },
      labelDisabled: {
        color: palette.additional["gray"][6],
      },
      error: {
        color: palette.error.main,
      },
    }),
)

export interface IRadioButtonProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  value: string
  label: string
  name?: string
  checked?: boolean
  disabled?: boolean
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void
}

const RadioInput: React.FC<IRadioButtonProps> = ({
  className,
  value,
  label,
  checked,
  disabled,
  onChange,
  ...props
}) => {
  const classes = useStyles()

  return (
    <label className={clsx(classes.radioContainer, className)}>
      <input
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={classes.radioInput}
        {...props}
      />
      <div
        className={clsx(classes.radio, {
          ["checked"]: checked,
        })}
      />
      {label && (
        <Typography
          className={clsx(classes.label, disabled && classes.labelDisabled)}
        >
          {label}
        </Typography>
      )}
    </label>
  )
}

export default RadioInput
