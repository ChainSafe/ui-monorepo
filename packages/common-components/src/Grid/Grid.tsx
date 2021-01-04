import React, { ReactNode } from "react"
import clsx from "clsx"
import {
  createFlexStyles,
  createGridStyles,
  createSpacingStyles,
} from "./Styles"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  AlignItems,
  JustifyContent,
  FlexDirection,
  FlexWrap,
  GridSize,
  SpacingSize,
} from "./types"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      display: "flex",
      ...theme.overrides?.Grid?.root,
    },
    ...createFlexStyles(),
    ...createGridStyles(theme),
    ...createSpacingStyles(theme),
  }),
)

export interface IGridProps {
  children?: ReactNode | ReactNode[]
  className?: string
  container?: boolean
  item?: boolean
  fullWidth?: boolean
  flexDirection?: FlexDirection
  alignItems?: AlignItems
  justifyContent?: JustifyContent
  flexWrap?: FlexWrap
  xs?: GridSize
  sm?: GridSize
  md?: GridSize
  lg?: GridSize
  xl?: GridSize
  spacing?: SpacingSize
}

const Grid: React.FC<IGridProps> = ({
  className,
  container,
  item,
  fullWidth,
  flexDirection = "column",
  alignItems,
  justifyContent,
  flexWrap = "wrap",
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  ...rest
}: IGridProps) => {
  const classes = useStyles()

  const isContainer = container || !item

  const Component = "div"

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes["container"]]: isContainer,
          [classes["item"]]: !isContainer,
          [classes["fullWidth"]]: fullWidth && isContainer,
          [classes[`flex-direction-${flexDirection}`]]: !isContainer,
          [classes[`align-${alignItems}`]]: alignItems !== undefined,
          [classes[`justify-${justifyContent}`]]: justifyContent !== undefined,
          [classes[`flex-wrap-${flexWrap}`]]: flexWrap !== undefined,
          [classes[`grid-xs-${String(xs)}`]]: xs !== undefined,
          [classes[`grid-sm-${String(sm)}`]]: sm !== undefined,
          [classes[`grid-md-${String(md)}`]]: md !== undefined,
          [classes[`grid-lg-${String(lg)}`]]: lg !== undefined,
          [classes[`grid-xl-${String(xl)}`]]: xl !== undefined,
          [classes[`spacing-${String(spacing)}`]]:
            spacing !== undefined && isContainer,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Grid
