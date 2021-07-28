import React, { CSSProperties, ReactNode } from "react"
import {
  makeStyles,
  createStyles,
  ITheme,
  useTheme
} from "@chainsafe/common-theme"
import clsx from "clsx"
import Select, { Styles } from "react-select"
import { Typography } from "../Typography"

const useStyles = makeStyles(
  ({ animation, constants, palette, overrides }: ITheme) =>
    createStyles({
      root: {
        margin: 5,
        display: "block",
        ...overrides?.SelectInput?.root
      },
      label: {
        transitionDuration: `${animation.transform}ms`,
        display: "block",
        marginBottom: constants.generalUnit / 4,
        ...overrides?.SelectInput?.label
      },
      caption: {
        display: "block",
        marginTop: constants.generalUnit / 4,
        transitionDuration: `${animation.transform}ms`,
        color: palette.additional["gray"][7],
        "&.error": {
          color: palette.error.main
        },
        "&.warning": {
          color: palette.warning.main
        },
        ...overrides?.SelectInput?.caption
      }
    })
)

interface ISelectOption {
  value: string | number
  label: string | ReactNode | number
}

interface ISelectInputProps {
  className?: string
  size?: "large" | "medium" | "small"
  label?: string
  labelClassName?: string
  error?: string
  captionMessage?: string
  placeholder?: string
  options: ISelectOption[]
  onChange(value: any): void
  disabled?: boolean
  value?: any
  isMulti?: boolean
  isClearable?: boolean
  name?: string
  styles?: Partial<Styles>
}

const SelectInput: React.FC<ISelectInputProps> = ({
  className,
  size = "medium",
  disabled = false,
  onChange,
  label,
  labelClassName,
  placeholder = "Please select",
  options,
  captionMessage,
  value,
  isMulti,
  name,
  isClearable = false,
  styles
}) => {
  const classes = useStyles()
  const { palette, animation, typography, overrides }: ITheme = useTheme()
  const handleChange = (value: any) => {
    if (!disabled) {
      Array.isArray(value)
        ? onChange(value.map((v) => v.value))
        : onChange(value.value)
    }
  }
  const selectValue = Array.isArray(value)
    ? value.map((v) => options.find((o) => o.value === v))
    : options.find((o) => o.value === value)

  const overrideKeys = [
    "clearIndicator", "container", "control", "dropdownIndicator", "group", "groupHeading", "indicatorsContainer",
    "indicatorSeparator", "input", "loadingIndicator", "loadingMessage", "menu", "menuList", "menuPortal", "multiValue",
    "multiValueLabel", "multiValueRemove", "noOptionsMessage", "option", "placeholder", "singleValue", "valueContainer"
  ]

  // Creates entry to this format
  //   indicatorsContainer: (provided: any, state: any) => ({
  //     ...provided,
  //     ...(styles?.indicatorsContainer ? styles.indicatorsContainer({
  //       ...provided,
  //       ...overrides?.TagsInput?.indicatorsContainer
  //     }, state) : overrides?.TagsInput?.indicatorsContainer)
  //   }),
  const selectOverides: Partial<Styles> = {}
  overrideKeys.map(key => {
    selectOverides[key] = (provided: CSSProperties, state: any): CSSProperties => ({
      ...provided,
      ...(
        styles && styles[key]
          ? styles[key]({
            ...provided,
            ...overrides?.TagsInput?.[key]
          }, state)
          : ({
            ...provided,
            ...overrides?.TagsInput?.[key]
          })
      )
    })
  })
  selectOverides.container = (provided, state) => ({
    ...provided,
    outline: "none",
    border: `1px solid ${palette.additional["gray"][5]}`,
    backgroundColor: !state.isDisabled
      ? palette.common.white.main
      : palette.additional["gray"][3],
    borderRadius: 2,
    "&:hover": {
      border: `1px solid ${palette.primary.main}`
    },
    ...(
      styles && styles.container
        ? styles.container({
          ...provided,
          ...overrides?.SelectInput?.container
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.container
        })
    )
  })

  selectOverides.control = (provided, state) => ({
    ...provided,
    outline: "none",
    border: "none",
    borderRadius: 2,
    ...(
      styles && styles.control
        ? styles.control({
          ...provided,
          ...overrides?.SelectInput?.control
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.control
        })
    )
  })

  selectOverides.menu = (provided, state) => ({
    ...provided,
    marginTop: 2,
    marginBottom: 0,
    ...(
      styles && styles.menu
        ? styles.menu({
          ...provided,
          ...overrides?.SelectInput?.menu
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.menu
        })
    )
  })

  selectOverides.dropdownIndicator = (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen && "rotate(180deg)",
    transitionProperty: "transform",
    transitionDuration: `${animation.transform * 2}ms`,
    ...(
      styles && styles.dropdownIndicator
        ? styles.dropdownIndicator({
          ...provided,
          ...overrides?.SelectInput?.dropdownIndicator
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.dropdownIndicator
        })
    )
  })

  selectOverides.singleValue = (provided, state) => ({
    ...provided,
    ...typography.body2,
    color: !state.isDisabled
      ? palette.additional["gray"][8]
      : palette.additional["gray"][6],
    ...(
      styles && styles.singleValue
        ? styles.singleValue({
          ...provided,
          ...overrides?.SelectInput?.singleValue
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.singleValue
        })
    )
  })

  selectOverides.placeholder = (provided, state) => ({
    ...provided,
    color: !state.isDisabled
      ? palette.additional["gray"][8]
      : palette.additional["gray"][6],
    ...(
      styles && styles.placeholder
        ? styles.placeholder({
          ...provided,
          ...overrides?.SelectInput?.placeholder
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.placeholder
        })
    )
  })

  selectOverides.option = (provided, state) => ({
    ...provided,
    ...typography.body2,
    backgroundColor: state.isSelected && palette.additional["gray"][3],
    color: palette.additional["gray"][8],
    fontWeight: state.isSelected && typography.fontWeight.bold,
    "&:hover": {
      backgroundColor: palette.additional["blue"][1]
    },
    ...(
      styles && styles.option
        ? styles.option({
          ...provided,
          ...overrides?.SelectInput?.option
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.option
        })
    )
  })

  selectOverides.valueContainer = (provided, state) => ({
    ...provided,
    ...typography.body2,
    paddingTop: 0,
    paddingBottom: 0,
    ...(
      styles && styles.valueContainer
        ? styles.valueContainer({
          ...provided,
          ...overrides?.SelectInput?.valueContainer
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.valueContainer
        })
    )
  })

  selectOverides.indicatorsContainer = (provided, state) => ({
    ...provided,
    "& > div": {
      paddingTop: 0,
      paddingBottom: 0
    },
    ...(
      styles && styles.indicatorsContainer
        ? styles.indicatorsContainer({
          ...provided,
          ...overrides?.SelectInput?.indicatorsContainer
        }, state)
        : ({
          ...provided,
          ...overrides?.SelectInput?.indicatorsContainer
        })
    )
  })

  console.log(selectOverides)
  console.log(selectOverides.indicatorsContainer({}, {}))

  return (
    <div className={clsx(classes.root, className)}>
      {label && label.length > 0 && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.label, labelClassName)}
        >
          {label}
        </Typography>
      )}
      <Select
        options={options}
        isClearable={isClearable}
        onChange={handleChange}
        isDisabled={disabled}
        placeholder={placeholder}
        value={selectValue}
        isMulti={isMulti}
        name={name}
        styles={styles}
        theme={(selectTheme) => ({
          ...selectTheme,
          spacing: {
            ...selectTheme.spacing,
            controlHeight: size === "large" ? 40 : size === "medium" ? 32 : 24
          }
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
    </div>
  )
}

export default SelectInput
export { ISelectInputProps, ISelectOption }
