import React, { ChangeEvent } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"
import { SearchIcon } from "../Icons"
import { Spinner, LOADER } from "../Spinner"

const iconSize = {
  large: {
    height: 18,
    padding: 6,
  },
  medium: {
    height: 16,
    padding: 6,
  },
  small: {
    height: 16,
    padding: 4,
  },
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      ...theme.typography.body2,
      cursor: "pointer",
      "&.large": {
        fontSize: 14,
        lineHeight: "22px",
      },
      "&.medium": {
        fontSize: 14,
        lineHeight: "22px",
      },
      "&.small": {
        fontSize: 14,
        lineHeight: "22px",
      },
      "& .right > *:nth-child(2) svg": {
        fill: theme.palette.primary.main,
      },
      "& input": {
        transitionDuration: `${theme.animation.transform}ms`,
        display: "block",
        color: theme.palette["gray"][8],
        borderRadius: 2,
        "&:hover": {
          borderColor: theme.palette.primary.border,
        },
        "&:focus": {
          borderColor: theme.palette.primary.border,
          boxShadow: "0px 0px 4px rgba(24, 144, 255, 0.5)",
        },
      },
      "&.disabled": {
        "& input": {
          color: theme.palette["gray"][6],
          backgroundColor: theme.palette["gray"][3],
        },
      },
    },
    inputArea: {
      ...theme.typography.body2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      transitionDuration: `${theme.animation.transform}ms`,
      position: "relative",
      "&.large": {
        "& input": {
          fontSize: 16,
          lineHeight: "24px",
          padding: `${theme.constants.generalUnit}px ${
            theme.constants.generalUnit * 1.5
          }px`,
        },
      },
      "&.medium": {
        "& input": {
          padding: `${theme.constants.generalUnit * 0.625}px ${
            theme.constants.generalUnit * 1.5
          }px`,
        },
      },
      "&.small": {
        "& input": {
          padding: `${
            theme.constants.generalUnit / theme.constants.generalUnit
          }px ${theme.constants.generalUnit}px`,
        },
      },
    },
    input: {
      width: "100%",
      padding: `${theme.constants.generalUnit}px ${
        theme.constants.generalUnit * 2
      }px`,
      outline: "none",
      border: `1px solid ${theme.palette["gray"][6]}`,
      color: theme.palette["gray"][10],
      transitionDuration: `${theme.animation.transform}ms`,
    },
    standardIcon: {
      position: "absolute",
      top: "50%",
      transform: "translate(0, -50%)",
      transitionDuration: `${theme.animation.transform}ms`,
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
          marginLeft: 5,
        },
      },
      "&.right": {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      "& svg": {
        fill: theme.palette["gray"][7],
      },
      "&.large": {
        "&.right": {
          right: theme.constants.generalUnit * 1.5,
        },
        "& svg": {
          height: iconSize.large.height,
        },
      },
      "&.medium": {
        "&.right": {
          right: iconSize.medium.padding,
        },
        "& svg": {
          height: iconSize.medium.height,
        },
      },
      "&.small": {
        "&.right": {
          right: iconSize.small.padding,
        },
        "& svg": {
          height: iconSize.small.height,
        },
      },
    },
  }),
)

export interface SearchBarProps {
  className?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  size?: "large" | "medium" | "small"
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.SFC<SearchBarProps> = ({
  className,
  value,
  placeholder = "Search...",
  disabled = false,
  isLoading = false,
  size = "medium",
  onChange,
}: SearchBarProps) => {
  const classes = useStyles()
  return (
    <label
      className={clsx(classes.root, className, size, {
        ["disabled"]: disabled,
      })}
    >
      <div className={clsx(classes.inputArea, size)}>
        <input
          className={clsx(classes.input, {
            ["disabled"]: disabled || isLoading,
          })}
          disabled={disabled}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        <div className={clsx(classes.standardIcon, size, "right")}>
          <Spinner loader={LOADER.PulseLoader} size={12} loading={isLoading} />
          {!isLoading && <SearchIcon />}
        </div>
      </div>
    </label>
  )
}

export default SearchBar
