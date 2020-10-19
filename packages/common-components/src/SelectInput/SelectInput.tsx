import React, { FormEvent, ReactNode } from "react"
import {
  makeStyles,
  createStyles,
  ITheme,
  useTheme,
} from "@imploy/common-themes"
import clsx from "clsx"
import Select from "react-select"
import { Typography } from "../Typography"

const useStyles = makeStyles(
  ({ animation, constants, palette, overrides }: ITheme) =>
    createStyles({
      root: {
        ...overrides?.SelectInput?.root,
      },
      label: {
        transitionDuration: `${animation.transform}ms`,
        display: "block",
        marginBottom: constants.generalUnit / 4,
        ...overrides?.SelectInput?.label,
      },
      caption: {
        display: "block",
        marginTop: constants.generalUnit / 4,
        transitionDuration: `${animation.transform}ms`,
        color: palette.additional["gray"][7],
        "&.error": {
          color: palette.error.main,
        },
        "&.warning": {
          color: palette.warning.main,
        },
        ...overrides?.SelectInput?.caption,
      },
    }),
)

interface ISelectOption {
  value: string | number
  label: string | ReactNode | number
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
  size = "medium",
  disabled = false,
  onChange,
  label,
  placeholder = "Please select",
  options,
  captionMessage,
  value,
}) => {
  const classes = useStyles()
  const { palette, animation, typography, overrides }: ITheme = useTheme()
  const handleChange = (value: any) => {
    !disabled && onChange(value.value)
  }
  const selectValue = options.find((o) => o.value === value)

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
        value={selectValue}
        styles={{
          container: (provided, state) => ({
            ...provided,
            outline: "none",
            border: `1px solid ${palette.additional["gray"][5]}`,
            backgroundColor: !state.isDisabled
              ? palette.common.white.main
              : palette.additional["gray"][3],
            borderRadius: 2,
            "&:hover": {
              border: `1px solid ${palette.primary.main}`,
            },
            ...overrides?.SelectInput?.container,
          }),
          control: (provided) => ({
            ...provided,
            outline: "none",
            border: "none",
            borderRadius: 2,
            ...overrides?.SelectInput?.control,
          }),
          menu: (provided) => ({
            ...provided,
            marginTop: 2,
            marginBottom: 0,
            ...overrides?.SelectInput?.menu,
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && "rotate(180deg)",
            transitionProperty: "transform",
            transitionDuration: `${animation.transform * 2}ms`,
            ...overrides?.SelectInput?.dropdownIndicator,
          }),
          singleValue: (provided, state) => ({
            ...provided,
            ...typography.body2,
            color: !state.isDisabled
              ? palette.additional["gray"][8]
              : palette.additional["gray"][6],
            ...overrides?.SelectInput?.singleValue,
          }),
          placeholder: (provided, state) => ({
            ...provided,
            color: !state.isDisabled
              ? palette.additional["gray"][8]
              : palette.additional["gray"][6],
            ...overrides?.SelectInput?.placeholder,
          }),
          option: (provided, state) => ({
            ...provided,
            ...typography.body2,
            backgroundColor: state.isSelected && palette.additional["gray"][3],
            color: palette.additional["gray"][8],
            fontWeight: state.isSelected && typography.fontWeight.bold,
            "&:hover": {
              backgroundColor: palette.additional["blue"][1],
            },
            ...overrides?.SelectInput?.option,
          }),
          valueContainer: (provided) => ({
            ...provided,
            ...typography.body2,
            paddingTop: 0,
            paddingBottom: 0,
            ...overrides?.SelectInput?.valueContainer,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            "& > div": {
              paddingTop: 0,
              paddingBottom: 0,
            },
            ...overrides?.SelectInput?.indicatorsContainer,
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
export { ISelectInputProps, ISelectOption }
