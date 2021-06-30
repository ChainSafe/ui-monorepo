import React from "react"
import {
  makeStyles,
  createStyles,
  ITheme
} from "@chainsafe/common-theme"
import clsx from "clsx"
import AsyncSelect from "react-select/async"
import { Typography } from ".."
import { ValueType } from "react-select"

const useStyles = makeStyles(
  ({ palette, animation, constants, overrides }: ITheme) =>
    createStyles({
      root: {
        margin: 5,
        ...overrides?.TagsInput?.root
      },
      label: {
        transitionDuration: `${animation.transform}ms`,
        display: "block",
        marginBottom: constants.generalUnit / 4,
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
      }
    })
)

interface ITagOption {
  label: string
  value: any
}

interface ITagsInputProps {
  className?: string
  value: Array<ITagOption>
  placeholder?: string
  label?: string
  caption?: string
  disabled?:boolean
  fetchTag: (searchValue: string) => Promise<Array<ITagOption>>
  onChange(value: ValueType<ITagOption, true>): void
}

const TagsInput = ({
  className,
  value,
  placeholder,
  label,
  caption,
  fetchTag,
  disabled = false,
  onChange
}: ITagsInputProps) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      {label && label.length > 0 && (
        <Typography
          variant="body2"
          component="span"
          className={clsx(classes.label)}
        >
          {label}
        </Typography>
      )}
      <AsyncSelect
        isMulti
        cacheOptions={false}
        value={value}
        loadOptions={fetchTag}
        onInputChange={(inputVal) => fetchTag(inputVal)}
        isClearable={false}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        onChange={onChange}
        openMenuOnClick={false}
        openMenuOnFocus={false}
        placeholder={placeholder}
        isDisabled={disabled}
        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
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
    </div>)
}

export default TagsInput
export { ITagsInputProps }
