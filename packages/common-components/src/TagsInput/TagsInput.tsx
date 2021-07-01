import React from "react"
import {
  makeStyles,
  createStyles,
  ITheme
} from "@chainsafe/common-theme"
import clsx from "clsx"
import AsyncSelect from "react-select/async"
import { Typography } from ".."
import { Styles, ValueType } from "react-select"

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
  labelClassName?: string
  caption?: string
  disabled?: boolean
  fetchTags: (searchValue: string) => Promise<Array<ITagOption>>
  onChange: (value: ValueType<ITagOption, true>) => void
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
        styles={styles}
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
export { ITagsInputProps }
