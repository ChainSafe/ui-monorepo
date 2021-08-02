import React, { CSSProperties } from "react"
import {
  makeStyles,
  createStyles,
  ITheme,
  useTheme
} from "@chainsafe/common-theme"
import clsx from "clsx"
import AsyncSelect from "react-select/async"
import { Typography } from ".."
import { Styles, ValueType, ActionMeta, ActionTypes } from "react-select"

const useStyles = makeStyles(
  ({ palette, animation, constants, overrides }: ITheme) =>
    createStyles({
      root: {
        margin: 5,
        display: "block",
        cursor: "text",
        ...overrides?.TagsInput?.root
      },
      label: {
        margin: 5,
        transitionDuration: `${animation.transform}ms`,
        display: "block",
        marginBottom: constants.generalUnit / 4,
        cursor: "pointer",
        ...overrides?.TextInput?.label
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
      },
      asyncSelect:{
        margin: 5
      }
    })
)

interface ITagOption {
  label: string
  value: string
  data: any
}

interface ITagsInputProps {
  className?: string
  value: Array<ITagOption>
  placeholder?: string
  label?: string
  labelClassName?: string
  caption?: string
  disabled?: boolean
  fetchTags: (searchValue: string) => Promise<Array<ITagOption>>
  onChange: (value: ValueType<ITagOption, true>, action: ActionMeta<ITagOption>) => void
  styles?: Partial<Styles>
}

const TagsInput = ({
  className,
  value,
  placeholder,
  label,
  labelClassName,
  caption,
  fetchTags,
  disabled = false,
  onChange,
  styles
}: ITagsInputProps) => {
  const classes = useStyles()

  const { overrides } = useTheme<ITheme>()
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

  return (
    <label className={clsx(classes.root, className)}>
      {label && label.length > 0 && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.label, labelClassName)}
        >
          {label}
        </Typography>
      )}
      <AsyncSelect
        className={classes.asyncSelect}
        isMulti
        cacheOptions={false}
        value={value}
        loadOptions={fetchTags}
        onInputChange={(inputVal) => fetchTags(inputVal)}
        isClearable={false}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        onChange={onChange}
        openMenuOnClick={false}
        openMenuOnFocus={false}
        placeholder={placeholder}
        isDisabled={disabled}
        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
        styles={selectOverides as Partial<Styles>}
      />
      {caption && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.caption)}
        >
          {caption}
        </Typography>
      )}
    </label>)
}

export default TagsInput
export {
  ITagsInputProps,
  ITagOption,
  ValueType as ITagValueType,
  ActionMeta as ITagActionMeta,
  ActionTypes as ITagActionTypes
}
