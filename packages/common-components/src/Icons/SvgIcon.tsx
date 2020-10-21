import React, { ReactNode } from "react"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles(
  ({ animation, palette, constants, overrides }: ITheme) =>
    createStyles({
      root: {
        userSelect: "none",
        width: "1em",
        height: "1em",
        display: "inline-block",
        fontSize: "1.5em",
        transition: `all ${animation.transform}ms`,
        ...overrides?.Icons?.root,
      },
      colorPrimary: {
        fill: palette.primary.main,
      },
      colorSecondary: {
        fill: palette.secondary ? palette.secondary.main : "inherit",
      },
      colorError: {
        fill: palette.error.main,
      },
      colorSuccess: {
        fill: palette.success.main,
      },

      sizeInherit: {
        fontSize: "inherit",
      },

      sizeSmall: {
        fontSize: `${constants.generalUnit * 2}px`,
        ...overrides?.Icons?.size?.small,
      },
      sizeMedium: {
        fontSize: `${constants.generalUnit * 3}px`,
        ...overrides?.Icons?.size?.medium,
      },
      sizeLarge: {
        fontSize: `${constants.generalUnit * 4}px`,
        ...overrides?.Icons?.size?.large,
      },
      sizeExtraLarge: {
        fontSize: `${constants.generalUnit * 6}px`,
        ...overrides?.Icons?.size?.extraLarge,
      },
    }),
)

export interface SvgIconProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode | ReactNode[]
  className?: string
  color?: colorProp
  fontSize?: fontSizeProp
}

const SvgIcon: React.FC<SvgIconProps> = ({
  children,
  className,
  color = "inherit",
  fontSize = "medium",
  ...rest
}: SvgIconProps) => {
  const classes = useStyles()

  const Component = "span"

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes[`color${capitalize(color)}`]]: color !== "inherit",
          [classes[`size${capitalize(fontSize)}`]]: true,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default SvgIcon
