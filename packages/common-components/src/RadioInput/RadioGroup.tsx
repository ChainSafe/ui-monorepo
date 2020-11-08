import React, { useState, useContext } from "react"
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
        // display: "inline-block",
        border: `1px solid ${palette.additional["gray"][3]}`,
        backgroundColor: palette.additional["gray"][3],
        position: "absolute",
        width: constants.generalUnit * 2,
        height: constants.generalUnit * 2,
        left: 0,
        top: 0,
        borderRadius: "50%",
        transition: `all ${animation.transform}ms ease`,
        "&.checked": {
          border: `4px solid ${palette.additional["gray"][3]}`,
          backgroundColor: palette.additional["blue"][6],
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

type RadioContextProps = {
  name: string
  value: string
  children: React.ReactNode | React.ReactNode[]
}

interface IRadioContext {
  name: string
  value: string
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
}

const RadioContext = React.createContext<IRadioContext | undefined>(undefined)

const RadioProvider = ({ children, name, value }: RadioContextProps) => {
  const [currentValue, setCurrentValue] = useState(value)
  return (
    <RadioContext.Provider
      value={{
        name: name,
        value: currentValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setCurrentValue(e.target.value),
      }}
    >
      {children}
    </RadioContext.Provider>
  )
}

export interface IRadioGroupProps {
  className?: string
  name: string
  value: string
}

const RadioGroup: React.FC<IRadioGroupProps> = ({
  children,
  className,
  name,
  value,
}) => {
  return (
    <div className={className}>
      <RadioProvider name={name} value={value}>
        {children}
      </RadioProvider>
    </div>
  )
}

export interface IRadioButtonProps {
  className?: string
  value: string
  label: string
  name?: string
  checked?: boolean
  disabled?: boolean
}

const RadioButton: React.FC<IRadioButtonProps> = ({
  className,
  value,
  label,
  checked,
  disabled,
}) => {
  const context = useContext(RadioContext)
  const classes = useStyles()
  return (
    <label className={clsx(classes.radioContainer, className)}>
      <input
        type="radio"
        {...context}
        value={value}
        className={classes.radioInput}
      />
      <div
        className={clsx(classes.radio, {
          ["checked"]: context ? context.value === value : checked,
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

export { RadioGroup, RadioButton }
