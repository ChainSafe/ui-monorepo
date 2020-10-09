import { ITheme } from "@imploy/common-themes"
import {
  AlignItems,
  JustifyContent,
  FlexDirection,
  FlexWrap,
  GridSize,
  SpacingSize,
} from "./types"

export const alignItemsOptions: AlignItems[] = [
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch",
]

export const justifyContentOptions: JustifyContent[] = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
]

export const flexDirectionOptions: FlexDirection[] = [
  "row",
  "column",
  "row-reverse",
  "column-reverse",
]

export const flexWrapOptions: FlexWrap[] = ["nowrap", "wrap", "wrap-reverse"]

export const gridSizeOptions: GridSize[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
]

export const spacingOptions: SpacingSize[] = [1, 2, 3, 4, 5, 6]

export const createFlexStyles = (): Record<string, React.CSSProperties> => ({
  ...alignItemsOptions.reduce(
    (accumulator: Record<string, any>, alignItemsOption) => ({
      ...accumulator,
      [`align-${alignItemsOption}`]: {
        "align-items": alignItemsOption,
      },
    }),
    {},
  ),
  ...justifyContentOptions.reduce(
    (accumulator: Record<string, any>, justifyContentOption) => ({
      ...accumulator,
      [`justify-${justifyContentOption}`]: {
        "justify-content": justifyContentOption,
      },
    }),
    {},
  ),
  ...flexDirectionOptions.reduce(
    (accumulator: Record<string, any>, flexDirectionOption) => ({
      ...accumulator,
      [`flex-direction-${flexDirectionOption}`]: {
        "flex-direction": flexDirectionOption,
      },
    }),
    {},
  ),
  ...flexWrapOptions.reduce(
    (accumulator: Record<string, any>, flexWrapOption) => ({
      ...accumulator,
      [`flex-wrap-${flexWrapOption}`]: {
        "flex-wrap": flexWrapOption,
      },
    }),
    {},
  ),
})

export const createGridStyles = ({
  breakpoints,
  overrides,
}: ITheme): Record<string, React.CSSProperties> => {
  const styles = {
    container: {
      display: "flex",
      width: "100%",
      ...overrides?.Grid?.container,
    },
    item: {
      flex: "1 1 0px",
      ...overrides?.Grid?.item,
    },
    fullWidth: {
      width: "100%",
      ...overrides?.Grid?.fullWidth,
    },
  }

  const gridBreakpoints = Object.keys(breakpoints.keys)
  const smallestBreakpoint = gridBreakpoints.shift()

  // for xs
  gridSizeOptions.forEach((gridSize) => {
    const widthPercent = `${Math.round((gridSize / 12) * 10e7) / 10e5}%`

    styles[`grid-${smallestBreakpoint}-${gridSize}`] = {
      flex: `0 0 ${widthPercent}`,
      maxWidth: `${widthPercent}`,
    }
  })

  gridBreakpoints.forEach((breakpointKey) => {
    const gridLevelStyles = {}

    gridSizeOptions.forEach((gridSize) => {
      const widthPercent = `${Math.round((gridSize / 12) * 10e7) / 10e5}%`

      gridLevelStyles[`grid-${breakpointKey}-${gridSize}`] = {
        flexBasis: widthPercent,
        flexGrow: 0,
        maxWidth: widthPercent,
      }
    })
    styles[
      `@media screen and (min-width: ${breakpoints.width(breakpointKey)}px)`
    ] = gridLevelStyles
  })

  return styles
}

export const createSpacingStyles = ({
  constants,
}: ITheme): Record<string, React.CSSProperties> => {
  const styles = {}

  spacingOptions.forEach((spacing) => {
    const themeSpacing = constants.generalUnit || 8

    styles[`spacing-${spacing}`] = {
      "& $item": {
        padding: `0 ${themeSpacing * spacing}px`,
      },
    }
  })

  return styles
}
