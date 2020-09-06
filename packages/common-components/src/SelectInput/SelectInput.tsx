import React, { FormEvent } from "react"
import {
  makeStyles,
  createStyles,
  ITheme,
  useTheme,
} from "@chainsafe/common-themes"
import clsx from "clsx"
import Select from "react-select"
import { Typography } from "../Typography"

// ```
// @keyframes: {
//   0: {

//   },
//   100%: {
//     opacity: 1,
//     paddingTop: initial,
//     paddingLeft: initial,
//     height: "auto",
//   }
// }
// animationFillMode: forwards
// animation: heightFade 400ms
// ```

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {},
    label: {
      transitionDuration: `${theme.animation.transform}ms`,
      display: "block",
      marginBottom: theme.constants.generalUnit / 4,
    },
    caption: {
      display: "block",
      marginTop: theme.constants.generalUnit / 4,
      transitionDuration: `${theme.animation.transform}ms`,
      color: theme.palette["gray"][7],
      "&.error": {
        color: theme.palette.error.main,
      },
      "&.warning": {
        color: theme.palette.warning.main,
      },
    },
  }),
)

interface ISelectOption {
  value?: string | number
  label: string | number
}
interface ISelectInputProps {
  className?: string
  size?: "large" | "medium" | "small"
  label?: string
  error?: string
  captionMessage?: string
  placeholder?: string
  options: ISelectOption[]
  onChange(event: FormEvent<HTMLInputElement>): void
  disabled?: boolean
  value?: any
}

const SelectInput: React.FC<ISelectInputProps> = ({
  className,
  // size = "medium",
  disabled = false,
  onChange,
  label,
  placeholder = "Please select",
  options,
  captionMessage,
}) => {
  const classes = useStyles()
  const theme: ITheme = useTheme()
  const handleChange = (event: any) => {
    console.log(event)
    !disabled && onChange(event)
  }

  // const animatedComponents = makeAnimated()
  return (
    <label className={clsx(classes.root, className)}>
      {label && label.length > 0 && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.label)}
        >
          {label}
        </Typography>
      )}
      <Select
        options={options}
        isClearable
        onChange={handleChange}
        isDisabled={disabled}
        placeholder={placeholder}
        closeMenuOnSelect={false}
        styles={{
          container: (provided, state) => ({
            ...provided,
            outline: "none",
            border: `1px solid ${theme.palette["gray"][5]}`,
            backgroundColor: !state.isDisabled
              ? theme.palette.common.white.main
              : theme.palette["gray"][3],
            transitionDuration: `${theme.animation.transform}ms`,
            borderRadius: "2px",
            "&:hover": {
              border: `1px solid ${theme.palette.primary.main}`,
            },
          }),
          control: (provided) => ({
            ...provided,
            outline: "none",
            border: "none",
            borderRadius: 2,
          }),
          menu: (provided, state) => {
            console.log(state.isDisabled)
            return {
              ...provided,
              marginTop: 2,
              marginBottom: 0,
              borderRadius: 2,
              opacity: !state.selectProps.menuIsOpen ? 0 : 1,
              paddingTop: !state.selectProps.menuIsOpen ? 0 : "initial",
              paddingLeft: !state.selectProps.menuIsOpen ? 0 : "initial",
              height: !state.selectProps.menuIsOpen ? 0 : "auto",
              transitionDuration: `${theme.animation.transform}ms`,
            }
          },
          dropdownIndicator: (provided, state) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && "rotate(180deg)",
            transitionProperty: "transform",
            transitionDuration: `${theme.animation.transform * 2}ms`,
          }),
          menuList: (provided) => ({
            ...provided,
          }),
          singleValue: (provided, state) => ({
            ...provided,
            color: !state.isDisabled
              ? theme.palette["gray"][8]
              : theme.palette["gray"][6],
          }),
          placeholder: (provided, state) => ({
            ...provided,
            color: !state.isDisabled
              ? theme.palette["gray"][8]
              : theme.palette["gray"][6],
          }),
        }}
      />
      {captionMessage && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.caption)}
        >
          {captionMessage}
        </Typography>
      )}
    </label>
  )
}

export default SelectInput
export { ISelectInputProps as IDropdownProps }
