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

export interface ISelectOption {
  value?: string | number
  label: string | number
}

export interface ISelectInputProps {
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
  size = "medium",
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
    !disabled && onChange(event)
  }

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
        isMenuOpen={true}
        styles={{
          container: (provided, state) => ({
            ...provided,
            outline: "none",
            border: `1px solid ${theme.palette["gray"][5]}`,
            backgroundColor: !state.isDisabled
              ? theme.palette.common.white.main
              : theme.palette["gray"][3],
            borderRadius: 2,
            "&:hover": {
              border: `1px solid ${theme.palette.primary.main}`,
            },
          }),
          control: (provided) => ({
            ...provided,
            outline: "none",
            border: "none",
          }),
          menu: (provided) => ({
            ...provided,
            marginTop: 2,
            marginBottom: 0,
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && "rotate(180deg)",
            transitionProperty: "transform",
            transitionDuration: `${theme.animation.transform * 2}ms`,
          }),
          singleValue: (provided, state) => ({
            ...provided,
            ...theme.typography.body2,
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
          option: (provided, state) => ({
            ...provided,
            ...theme.typography.body2,
            backgroundColor: state.isSelected && theme.palette["gray"][3],
            color: theme.palette["gray"][8],
            fontWeight: state.isSelected && theme.typography.fontWeight.bold,
            "&:hover": {
              backgroundColor: theme.palette["blue"][1],
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            ...theme.typography.body2,
            paddingTop: 0,
            paddingBottom: 0,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            "& > div": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          }),
        }}
        theme={(selectTheme) => ({
          ...selectTheme,
          spacing: {
            ...selectTheme.spacing,
            controlHeight: size === "large" ? 40 : size === "medium" ? 32 : 24,
          },
        })}
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
