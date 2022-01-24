import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import React, { ReactNode, useCallback, useMemo, useState } from "react"
import { Typography } from "../Typography"

interface IStyleProps {
  size: number
}

const SIZES = {
  small: 14,
  medium: 16,
  large: 20
}

const PADDING = 2

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, overrides, palette }: ITheme) =>
    createStyles({
      root : {
        padding: `${constants.generalUnit}px 0`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        cursor: "pointer",
        "&.disabled": {
          cursor: "initial"
        },
        [breakpoints.down("md")]: {
          marginBottom: 0
        },
        ...overrides?.Tabs?.root
      },
      label: {
        marginRight: constants.generalUnit,
        ...overrides?.ToggleSwitch?.label
      },
      background: ({ size }: IStyleProps) => ({
        boxSizing: "border-box",
        display: "block",
        position: "relative",
        backgroundColor: palette.additional.gray[6],
        borderRadius: size,
        padding: PADDING,
        height: size,
        width: `calc(${size * 2}px - ${PADDING * 2}px)`,
        transitionDuration: `${animation.transform}ms`,
        ...overrides?.ToggleSwitch?.background
      }),
      dot: ({ size }: IStyleProps) => ({
        display: "block",
        position: "absolute",
        borderRadius: "100%",
        height: `calc(${size}px - ${PADDING * 2}px)`,
        width: `calc(${size}px - ${PADDING * 2}px)`,
        backgroundColor: palette.additional.gray[1],
        transitionDuration: `${animation.transform}ms`,
        top: "50%",
        transform: "translateY(-50%)",
        "&.left": {
          left: PADDING
        },
        "&.right": {
          left: "50%"
        },
        "&.error": {
          backgroundColor: palette.error.main
        },
        ...overrides?.ToggleSwitch?.dot
      })
    })
)

interface ToggleSwitchInjectedClasses {
  root?: string
  label?: string
  background?: string
  dot?: string
}

// Could allow for a slider to be made from this
interface IToggleOption {
  value: any
  label?: string | ReactNode | number
}

interface IToggleSwitch {
  left: IToggleOption
  right: IToggleOption
  onChange(value: any): void
  injectedClasses?: ToggleSwitchInjectedClasses
  size?: "large" | "medium" | "small" | number
  error?: string
  disabled?: boolean
  value?: any
  testId?: string
  // name?: string
}

const ToggleSwitch = ({ injectedClasses, disabled, left, right, onChange, value, size, error, testId }: IToggleSwitch) => {
  const resolvedSize = useMemo(() => {
    switch (size) {
      case "large":
        return SIZES.large
      case "medium":
        return SIZES.medium
      case "small":
        return SIZES.small
      case undefined:
        return SIZES.medium
      default:
        return size
    }
  }, [size])
  const classes = useStyles({ size: resolvedSize })
  const [side, setSide] = useState<"left" | "right">(value && right.value === value ? "right" : "left")

  const onToggle = useCallback(() => {
    if (disabled) return
    if (side === "left") {
      setSide("right")
      onChange(right.value)
    } else {
      setSide("left")
      onChange(left.value)
    }
  }, [left, right, side, onChange, disabled])

  return <section
    className={clsx(classes.root, injectedClasses?.root, {
      "disabled": disabled
    })}
    onClick={onToggle}
    data-testid={`toggle-switch-${testId}`}
  >
    {
      side === "left" && left.label && (
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.label, injectedClasses?.label, {
            "error": !!error
          })}
        >
          { left.label }
        </Typography>
      )
    }
    {
      side === "right" && right.label && (
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.label, injectedClasses?.label, {
            "error": !!error
          })}
        >
          { right.label }
        </Typography>
      )
    }
    <div className={clsx(classes.background, size, injectedClasses?.background, {
      "error": !!error
    })}>
      <div className={clsx(classes.dot, side, injectedClasses?.dot, {
        "error": !!error
      })}>
      </div>
    </div>
  </section>
}

export default ToggleSwitch
export { IToggleSwitch, IToggleOption, ToggleSwitchInjectedClasses }
