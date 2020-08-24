import { ITheme } from "@chainsafe/common-themes"

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
  0,
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

export const createFlexStyles = (): Record<string, React.CSSProperties> => ({
  ...Object.assign(
    {},
    ...alignItemsOptions.map(alignItemsOption => ({
      [`align-${alignItemsOption}`]: {
        "align-items": alignItemsOption,
      },
    })),
  ),
  ...Object.assign(
    {},
    ...justifyContentOptions.map(justifyContentOption => ({
      [`justify-${justifyContentOption}`]: {
        "justify-content": justifyContentOption,
      },
    })),
  ),
  ...Object.assign(
    {},
    ...flexDirectionOptions.map(flexDirectionOption => ({
      [`flex-direction-${flexDirectionOption}`]: {
        "flex-direction": flexDirectionOption,
      },
    })),
  ),
  ...Object.assign(
    {},
    ...flexWrapOptions.map(flexWrapOption => ({
      [`flex-wrap-${flexWrapOption}`]: {
        "flex-wrap": flexWrapOption,
      },
    })),
  ),
})

export const createGridStyles = (
  theme: ITheme,
): Record<string, React.CSSProperties> => {
  const styles = {
    container: {
      display: "flex",
      width: "100%",
    },
    item: {
      flex: "1 1 0px",
    },
  }

  const gridBreakpoints = Object.keys(theme.breakpoints)
  const smallestBreakpoint = gridBreakpoints.shift()

  // for xs
  gridSizeOptions.forEach(gridSize => {
    const widthPercent = `${Math.round((gridSize / 12) * 10e7) / 10e5}%`

    styles[`grid-${smallestBreakpoint}-${gridSize}`] = {
      flex: `0 0 ${widthPercent}`,
      maxWidth: `${widthPercent}`,
    }
  })

  gridBreakpoints.forEach(breakpointKey => {
    const gridLevelStyles = {}

    gridSizeOptions.forEach(gridSize => {
      const widthPercent = `${Math.round((gridSize / 12) * 10e7) / 10e5}%`

      gridLevelStyles[`grid-${breakpointKey}-${gridSize}`] = {
        flex: `0 0 ${widthPercent}`,
        maxWidth: `${widthPercent}`,
      }
    })
    styles[
      `@media screen and (min-width: ${theme.breakpoints[breakpointKey]}px)`
    ] = gridLevelStyles
  })

  return styles
}
