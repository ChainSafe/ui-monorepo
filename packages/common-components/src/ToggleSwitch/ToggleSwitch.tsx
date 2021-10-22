import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import React, { ReactNode, useCallback, useState } from "react"
import { Typography } from ".."

interface IStyleProps {
  size: "large" | "medium" | "small" | number | undefined
}

const SIZES = {
  small: 14,
  medium: 16,
  large: 20
}

const useStyles = makeStyles(
  ({ breakpoints, overrides }: ITheme) =>
    createStyles({
      root : {
        [breakpoints.down("md")]: {
          marginBottom: 0
        },
        ...overrides?.Tabs?.root
      },
      background: ({ size }: IStyleProps) => ({
        height: size && typeof size === "number" ? size : "initial",
        width: size && typeof size === "number" ? size * 2 : "initial",
        "&.large": {
          height: SIZES.large,
          width: SIZES.large * 2
        },
        "&.medium": {
          height: SIZES.medium,
          width: SIZES.medium * 2
        },
        "&.small": {
          height: SIZES.small,
          width: SIZES.small * 2
        }
      }),
      dot: {

      }
    })
)

interface ToggleSwitchInjectedClasses {
  root?: string
  background?: string
  dot?: string
}

// Could allow for a slider to be made from this
interface IToggleOption {
  value: string | number
  label?: string | ReactNode | number
}

interface IToggleSwitch {
  injectedClasses?: ToggleSwitchInjectedClasses
  left: IToggleOption
  right: IToggleOption
  onChange(value: string | number): void
  size?: "large" | "medium" | "small" | number
  error?: string
  disabled?: boolean
  value?: string | number
  isClearable?: boolean
  // name?: string
}

const ToggleSwitch = ({ injectedClasses, left, right, onChange, value, size }: IToggleSwitch) => {
  const classes = useStyles({ size })
  const [side, setSide] = useState<"left" | "right">(value && right.value === value ? "right" : "left")

  const onToggle = useCallback(() => {
    if (side === "left") {
      setSide("right")
      onChange(right.value)
    } else {
      setSide("left")
      onChange(left.value)
    }
  }, [left, right, side, onChange])

  return <section
    className={clsx(classes.root, injectedClasses?.root)}
    onClick={onToggle}
  >
    {
      side === "left" && left.label && (
        <Typography
          component="p"
          variant="body1"
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
        >
          { right.label }
        </Typography>
      )
    }
    <div className={clsx(classes.background, size, injectedClasses?.background)}>
      <div className={clsx(classes.dot, injectedClasses?.dot)}>
      </div>
    </div>
  </section>
}

export default ToggleSwitch
export { IToggleSwitch, IToggleOption, ToggleSwitchInjectedClasses }
