import React, { ChangeEvent } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"
import { SearchIcon } from "../Icons"
import { Spinner, LOADER } from "../Spinner"

const iconSize = {
  large: {
    height: 18,
    padding: 6
  },
  medium: {
    height: 16,
    padding: 6
  },
  small: {
    height: 16,
    padding: 4
  }
}

const useStyles = makeStyles(
  ({ constants, palette, animation, overrides, typography }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        ...typography.body2,
        display: "block",
        cursor: "pointer",
        "&.large": {
          fontSize: 14,
          lineHeight: "22px",
          ...overrides?.SearchBar?.size?.large
        },
        "&.medium": {
          fontSize: 14,
          lineHeight: "22px",
          ...overrides?.SearchBar?.size?.medium
        },
        "&.small": {
          fontSize: 14,
          lineHeight: "22px",
          ...overrides?.SearchBar?.size?.small
        },
        "& .right > *:nth-child(2) svg": {
          fill: palette.primary.main
        },
        "& input": {
          transitionDuration: `${animation.transform}ms`,
          display: "block",
          color: palette.additional["gray"][8],
          borderRadius: 2,
          "&:hover": {
            borderColor: palette.primary.border,
            ...overrides?.SearchBar?.input?.hover
          },
          "&:focus": {
            borderColor: palette.primary.border,
            boxShadow: "0px 0px 4px rgba(24, 144, 255, 0.5)",
            ...overrides?.SearchBar?.input?.focus
          },
          ...overrides?.SearchBar?.input?.root
        },
        "&.disabled": {
          "& input": {
            color: palette.additional["gray"][6],
            backgroundColor: palette.additional["gray"][3],
            ...overrides?.SearchBar?.input?.disabled
          }
        },
        ...overrides?.SearchBar?.root
      },
      inputArea: {
        ...typography.body2,
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        transitionDuration: `${animation.transform}ms`,
        position: "relative",
        "&.large": {
          "& input": {
            fontSize: 16,
            lineHeight: "24px",
            padding: `${constants.generalUnit}px ${
              constants.generalUnit * 1.5
            }px`
          },
          ...overrides?.SearchBar?.inputArea?.large
        },
        "&.medium": {
          "& input": {
            padding: `${constants.generalUnit * 0.625}px ${
              constants.generalUnit * 1.5
            }px`
          },
          ...overrides?.SearchBar?.inputArea?.medium
        },
        "&.small": {
          "& input": {
            padding: `${constants.generalUnit / constants.generalUnit}px ${
              constants.generalUnit
            }px`
          }
        }
      },
      input: {
        width: "100%",
        height: "100%",
        padding: `${constants.generalUnit}px ${constants.generalUnit * 2}px`,
        outline: "none",
        border: `1px solid ${palette.additional["gray"][6]}`,
        color: palette.additional["gray"][10],
        transitionDuration: `${animation.transform}ms`
      },
      standardIcon: {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        transitionDuration: `${animation.transform}ms`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& > span": {
          width: "auto",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "&:last-child": {
            marginLeft: 5
          }
        },
        "& > div": {
          width: "auto",
          height: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          "&:last-child": {
            marginLeft: 5
          }
        },
        "&.right": {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center"
        },
        "& svg": {
          fill: palette.additional["gray"][7]
        },
        "&.large": {
          "&.right": {
            right: constants.generalUnit * 1.5
          },
          "& svg": {
            height: iconSize.large.height
          },
          ...overrides?.SearchBar?.standardIcon?.size?.small
        },
        "&.medium": {
          "&.right": {
            right: iconSize.medium.padding
          },
          "& svg": {
            height: iconSize.medium.height
          },
          ...overrides?.SearchBar?.standardIcon?.size?.medium
        },
        "&.small": {
          "&.right": {
            right: iconSize.small.padding
          },
          "& svg": {
            height: iconSize.small.height
          },
          ...overrides?.SearchBar?.standardIcon?.size?.small
        },
        ...overrides?.SearchBar?.standardIcon?.root
      }
    })
)

export interface SearchBarProps {
  className?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  name?: string
  loaderType?: LOADER
  size?: "large" | "medium" | "small"
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  value,
  placeholder = "Search...",
  disabled = false,
  isLoading = false,
  loaderType = LOADER.PulseLoader,
  size = "large",
  name,
  onChange
}: SearchBarProps) => {
  const classes = useStyles()
  const spinnerSize = size === "large" ? 12 : size === "medium" ? 8 : 6
  return (
    <label
      className={clsx(classes.root, className, size, {
        ["disabled"]: disabled
      })}
    >
      <div className={clsx(classes.inputArea, size)}>
        <input
          className={clsx(classes.input, {
            ["disabled"]: disabled
          })}
          disabled={disabled}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        <div className={clsx(classes.standardIcon, size, "right")}>
          <Spinner
            loader={loaderType}
            size={spinnerSize}
            loading={isLoading}
          />
          {!isLoading && <SearchIcon />}
        </div>
      </div>
    </label>
  )
}

export default SearchBar
