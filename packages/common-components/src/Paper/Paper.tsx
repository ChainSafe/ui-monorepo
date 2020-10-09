import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@imploy/common-themes"
import clsx from "clsx"
import { ITheme } from "@imploy/common-themes"
const useStyles = makeStyles(
  ({ shadows, constants, palette, overrides }: ITheme) => {
    const shadowStyles = {}
    Object.keys(shadows).forEach((shadow) => {
      shadowStyles[`shadow-${shadow}`] = {
        boxShadow: shadows[shadow],
      }
    })
    return createStyles({
      root: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        width: "max-content",
        padding: `${constants.generalUnit}px`,
        ...overrides?.Paper?.root,
      },
      fullWidth: {
        width: "inherit",
      },
      rounded: {
        borderRadius: 4,
        ...overrides?.Paper?.rounded,
      },
      bordered: {
        border: `1px solid ${palette.additional["gray"][5]}`,
        ...overrides?.Paper?.bordered,
      },
      ...shadowStyles,
    })
  },
)
export type PaperShape = "square" | "rounded"
export interface IPaperProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode | ReactNode[]
  className?: string
  shape?: PaperShape
  border?: boolean
  fullWidth?: boolean
  shadow?: "shadow1" | "shadow2" | string | "none"
}
const Paper = React.forwardRef(
  (
    {
      children,
      className,
      shape = "rounded",
      border,
      fullWidth,
      shadow = "shadow1",
      ...rest
    }: IPaperProps,
    forwardedRef: any,
  ) => {
    const classes = useStyles()
    return (
      <div
        className={clsx(
          classes.root,
          shape === "rounded" && classes.rounded,
          border && classes.bordered,
          fullWidth && classes.fullWidth,
          shadow !== "none" && classes[`shadow-${shadow}`],
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children}
      </div>
    )
  },
)
export default Paper
