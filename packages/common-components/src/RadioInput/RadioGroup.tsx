import React, { createContext, useState, useContext } from "react"
import { makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles(() =>
  createStyles({
    radio: {
      ":checked": {
        position: "absolute",
        left: "-9999px",
        paddingLeft: "28px",
        cursor: "pointer",
        lineHeight: "20px",
        display: "inline-block",
        color: "#666",
        ":after": {
          content: "",
          width: "12px",
          height: "12px",
          background: "#F87DA9",
          position: "absolute",
          top: "4px",
          left: "4px",
          borderRadius: "100%",
          transition: "all 0.2s ease",
        },
      },
      ":not(:checked)": {
        position: "absolute",
        left: "-9999px",
      },
    },
    label: {
      position: "relative",
      paddingLeft: "28px",
      cursor: "pointer",
      lineHeight: "20px",
      display: "inline-block",
      color: "#666",
      ":before": {
        content: "",
        position: "absolute",
        left: 0,
        top: 0,
        width: "18px",
        height: "18px",
        border: "1px solid #ddd",
        borderRadius: "100%",
        background: "#fff",
      },
      ":after": {
        content: "",
        width: "12px",
        height: "12px",
        background: "#F87DA9",
        position: "absolute",
        top: "4px",
        left: "4px",
        borderRadius: "100%",
        transition: "all 0.2s ease",
      },
      ":not(:checked) + label:after": {
        opacity: 0,
        transform: "scale(0)",
      },
    },
  }),
)

const useRadioButtons = (name: string) => {
  const [value, setState] = useState<any | undefined>(undefined)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value)
  }

  const inputProps = {
    onChange: handleChange,
    name,
    type: "radio",
  }

  return [value, inputProps]
}

const RadioGroupContext = createContext<string | undefined>(undefined)

const RadioGroup: React.FC<any> = ({ children, name }: any) => {
  const [, inputProps] = useRadioButtons(name)

  return (
    <RadioGroupContext.Provider value={inputProps}>
      {children}
    </RadioGroupContext.Provider>
  )
}

export interface IRadioButtonProps {
  className?: string
  value: string
  label: string
}

const RadioButton: React.FC<IRadioButtonProps> = (props) => {
  const context = useContext(RadioGroupContext)
  const classes = useStyles()
  return (
    <label className={classes.label}>
      <input {...props} {...context} className={classes.radio} />
      {props.label}
    </label>
  )
}

export { RadioGroup, RadioButton }
